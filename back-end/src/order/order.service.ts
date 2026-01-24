import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { OrderStatus } from '@prisma/client'

import { CartService } from '@/cart/cart.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrderQueryDto } from './dto/order-query.dto'

@Injectable()
export class OrderService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cartService: CartService
	) {}

	async createOrder(userId: string, dto: CreateOrderDto) {
		const cart = await this.cartService.getCart(userId)

		if (!cart.items || cart.items.length === 0) {
			throw new BadRequestException('Корзина пуста')
		}

		for (const item of cart.items) {
			const product = await this.prisma.product.findUnique({
				where: { id: item.productId }
			})

			if (!product) {
				throw new NotFoundException(`Товар ${item.name} не найден`)
			}

			if (product.quantity < item.quantity) {
				throw new BadRequestException(
					`Недостаточно товара "${product.name}" на складе. Доступно: ${product.quantity}`
				)
			}
		}

		const order = await this.prisma.$transaction(async prisma => {
			const newOrder = await prisma.order.create({
				data: {
					firstName: dto.firstName,
					lastName: dto.lastName,
					email: dto.email,
					userId,
					totalPrice: cart.total,
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

			for (const item of cart.items) {
				await prisma.orderItem.create({
					data: {
						orderId: newOrder.id,
						productId: item.productId,
						quantity: item.quantity,
						amountItem: item.price * item.quantity
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

			return newOrder
		})

		await this.cartService.clearCart(userId)

		return this.getOrderById(order.id, userId)
	}

	async getUserOrders(userId: string) {
		const orders = await this.prisma.order.findMany({
			where: { userId },
			include: {
				orderItems: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								price: true,
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

		return orders
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
								price: true,
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

		if (status) {
			where.status = status
		}

		if (userId) {
			where.userId = userId
		}

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

		const orders = await this.prisma.order.findMany({
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
								price: true,
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

		return orders
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

		const updatedOrder = await this.prisma.order.update({
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
								price: true,
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

		return updatedOrder
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
