import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { OrderStatus } from '@prisma/client'

import { CartService } from '@/cart/cart.service'
import { PrismaService } from '@/prisma/prisma.service'
import { PromoCodeService } from '@/promo-code/promo-code.service'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrderQueryDto } from './dto/order-query.dto'

type CartItemSnapshot = {
	productId: number
	quantity: number
	price: number
	name: string
	image?: string | null
}

@Injectable()
export class OrderService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cartService: CartService,
		private readonly promoCodeService: PromoCodeService
	) {}

	async createOrder(userId: string, dto: CreateOrderDto) {
		const cart = await this.cartService.getCart(userId)
		const cartItems = cart.items as CartItemSnapshot[]

		if (!cartItems.length) {
			throw new BadRequestException('Корзина пуста')
		}

		const productIds: number[] = Array.from(
			new Set(cartItems.map(item => item.productId))
		)

		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productIds
				}
			},
			select: {
				id: true,
				name: true,
				priceUSD: true,
				quantity: true
			}
		})

		const productMap = new Map(products.map(product => [product.id, product]))
		let subtotalPrice = 0

		const preparedItems = cartItems.map(item => {
			const product = productMap.get(item.productId)

			if (!product) {
				throw new NotFoundException(`Товар с ID ${item.productId} не найден`)
			}

			if (product.quantity < item.quantity) {
				throw new BadRequestException(
					`Недостаточно товара "${product.name}" на складе. Доступно: ${product.quantity}`
				)
			}

			const unitPrice = product.priceUSD
			const amountItem = unitPrice * item.quantity

			subtotalPrice += amountItem

			return {
				productId: item.productId,
				quantity: item.quantity,
				unitPrice,
				amountItem
			}
		})

		let promoValidation: {
			promo: { id: number; code: string }
			discountAmount: number
		} | null = null

		if (dto.promoCode?.trim()) {
			promoValidation = await this.promoCodeService.getValidatedPromoCode(
				dto.promoCode,
				subtotalPrice
			)
		}

		const discountAmount = promoValidation?.discountAmount ?? 0
		const totalPrice = subtotalPrice - discountAmount

		const order = await this.prisma.$transaction(async prisma => {
			const newOrder = await prisma.order.create({
				data: {
					firstName: dto.firstName,
					lastName: dto.lastName,
					email: dto.email,
					userId,
					subtotalPrice,
					discountAmount,
					totalPrice,
					promoCode: promoValidation?.promo.code,
					promoCodeId: promoValidation?.promo.id,
					status: OrderStatus.PENDING,
					shippingAddress: dto.shippingAddress,
					shippingCity: dto.shippingCity,
					shippingPostalCode: dto.shippingPostalCode,
					phoneNumber: dto.phoneNumber,
					notes: dto.notes
				},
				include: {
					user: {
						select: {
							id: true,
							email: true,
							displayName: true,
							picture: true
						}
					}
				}
			})

			for (const item of preparedItems) {
				await prisma.orderItem.create({
					data: {
						orderId: newOrder.id,
						productId: item.productId,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						amountItem: item.amountItem
					}
				})

				await prisma.product.update({
					where: { id: item.productId },
					data: {
						quantity: {
							decrement: item.quantity
						}
					}
				})
			}

			if (promoValidation) {
				await prisma.promoCode.update({
					where: { id: promoValidation.promo.id },
					data: {
						usedCount: {
							increment: 1
						}
					}
				})
			}

			return newOrder
		})

		await this.cartService.clearCart(userId)

		return this.getOrderById(order.id, userId)
	}

	async getUserOrders(userId: string) {
		return this.prisma.order.findMany({
			where: { userId },
			include: {
				orderItems: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
								priceUSD: true,
								priceEUR: true,
								priceUAH: true,
								productImages: {
									select: {
										url: true,
										isMain: true
									},
									where: { isMain: true },
									take: 1
								}
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async getOrderById(orderId: number, userId?: string) {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId },
			include: {
				user: {
					select: {
						id: true,
						email: true,
						displayName: true,
						picture: true
					}
				},
				orderItems: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
								priceUSD: true,
								priceEUR: true,
								priceUAH: true,
								productImages: {
									select: {
										url: true,
										isMain: true
									},
									where: { isMain: true },
									take: 1
								}
							}
						}
					}
				}
			}
		})

		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		if (userId && order.userId !== userId) {
			throw new ForbiddenException('Доступ заблокирован')
		}

		return order
	}

	async getAllOrders(query: OrderQueryDto) {
		const { status, userId, search } = query
		const where: any = {}

		if (status) where.status = status
		if (userId) where.userId = userId

		if (search) {
			where.OR = [
				{
					user: {
						email: {
							contains: search,
							mode: 'insensitive'
						}
					}
				},
				{
					user: {
						displayName: {
							contains: search,
							mode: 'insensitive'
						}
					}
				}
			]
		}

		return this.prisma.order.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						email: true,
						displayName: true,
						picture: true
					}
				},
				orderItems: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
								priceUSD: true,
								priceEUR: true,
								priceUAH: true,
								productImages: {
									select: {
										url: true,
										isMain: true
									},
									where: { isMain: true },
									take: 1
								}
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async updateOrderStatus(orderId: number, status: OrderStatus) {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId }
		})

		if (!order) {
			throw new NotFoundException('Заказ не найдено')
		}

		const validTransitions: Record<OrderStatus, OrderStatus[]> = {
			[OrderStatus.PENDING]: [OrderStatus.PAYED],
			[OrderStatus.PAYED]: [OrderStatus.SHIPPED],
			[OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
			[OrderStatus.DELIVERED]: []
		}

		if (!validTransitions[order.status].includes(status)) {
			throw new BadRequestException(
				`Нельзя сменить статус с ${order.status} на ${status}`
			)
		}

		return this.prisma.order.update({
			where: { id: orderId },
			data: { status },
			include: {
				user: {
					select: {
						id: true,
						email: true,
						displayName: true,
						picture: true
					}
				},
				orderItems: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
								priceUSD: true,
								priceEUR: true,
								priceUAH: true,
								productImages: {
									select: {
										url: true,
										isMain: true
									},
									where: { isMain: true },
									take: 1
								}
							}
						}
					}
				}
			}
		})
	}

	async getPendingOrdersCount(userId: string) {
		const count = await this.prisma.order.count({
			where: {
				userId,
				status: 'PENDING'
			}
		})

		return { count }
	}
}
