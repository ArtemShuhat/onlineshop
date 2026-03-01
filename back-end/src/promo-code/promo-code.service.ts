import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { randomBytes } from 'crypto'

import { CartService } from '@/cart/cart.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CreatePromoCodeDto } from './dto/create-promo-code.dto'
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto'
import { PromoCode } from '__generated__'

type CartItemSnapshot = {
	productId: number
	quantity: number
	price: number
	name: string
	image?: string | null
}

@Injectable()
export class PromoCodeService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cartService: CartService
	) {}

	async create(dto: CreatePromoCodeDto) {
		this.validateCreateDto(dto)

		let code = this.normalizeCode(dto.code ?? this.generateCode())

		if (dto.code) {
			const existing = await this.prisma.promoCode.findUnique({
				where: { code }
			})

			if (existing) {
				this.throwBadRequest(
					'PROMO_CODE_ALREADY_EXISTS',
					'errors.promoCode.alreadyExists'
				)
			}
		} else {
			while (await this.prisma.promoCode.findUnique({ where: { code } })) {
				code = this.generateCode()
			}
		}

		return this.prisma.promoCode.create({
			data: {
				code,
				percentOff: dto.percentOff,
				minOrderAmount: dto.minOrderAmount,
				maxUses: dto.maxUses,
				isActive: dto.isActive ?? true,
				startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
				expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined
			}
		})
	}

	async getAll() {
		return this.prisma.promoCode.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async updateStatus(id: number, isActive: boolean) {
		const promoCode = await this.prisma.promoCode.findUnique({
			where: { id }
		})

		if (!promoCode) {
			this.throwNotFound('PROMO_CODE_NOT_FOUND', 'errors.promoCode.notFound')
		}

		return this.prisma.promoCode.update({
			where: { id },
			data: { isActive }
		})
	}

	async validateForCart(userId: string, dto: ValidatePromoCodeDto) {
		const cart = await this.cartService.getCart(userId)
		const cartItems = cart.items as CartItemSnapshot[]

		if (!cartItems.length) {
			this.throwBadRequest('CART_EMPTY', 'errors.cart.empty')
		}

		const subtotal = await this.calculateCartSubtotal(cartItems)
		const validation = await this.getValidatedPromoCode(dto.code, subtotal)

		return {
			promoCode: validation.promo.code,
			subtotal,
			discountAmount: validation.discountAmount,
			total: subtotal - validation.discountAmount
		}
	}

	async getValidatedPromoCode(code: string, subtotal: number) {
		const normalizedCode = this.normalizeCode(code)

		const promo = await this.prisma.promoCode.findUnique({
			where: { code: normalizedCode }
		})

		if (!promo) {
			this.throwNotFound('PROMO_CODE_NOT_FOUND', 'errors.promoCode.notFound')
		}

		this.assertPromoCodeIsValid(promo, subtotal)

		return {
			promo,
			discountAmount: this.calculateDiscountAmount(subtotal, promo)
		}
	}

	calculateDiscountAmount(subtotal: number, promo: PromoCode) {
		return Math.min(Math.floor((subtotal * promo.percentOff) / 100), subtotal)
	}

	private async calculateCartSubtotal(items: CartItemSnapshot[]) {
		const productIds: number[] = Array.from(
			new Set(items.map(item => item.productId))
		)

		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productIds
				}
			},
			select: {
				id: true,
				priceUSD: true,
				quantity: true
			}
		})

		const productMap = new Map(products.map(product => [product.id, product]))
		let subtotal = 0

		for (const item of items) {
			const product = productMap.get(item.productId)

			if (!product) {
				this.throwNotFound('PRODUCT_NOT_FOUND', 'errors.product.notFound')
			}

			if (product.quantity < item.quantity) {
				this.throwBadRequest(
					'PRODUCT_INSUFFICIENT_STOCK',
					'errors.product.insufficientStock'
				)
			}

			subtotal += product.priceUSD * item.quantity
		}

		return subtotal
	}

	private assertPromoCodeIsValid(promo: PromoCode, subtotal: number) {
		const now = new Date()

		if (!promo.isActive) {
			this.throwBadRequest('PROMO_CODE_INACTIVE', 'errors.promoCode.inactive')
		}

		if (promo.startsAt && promo.startsAt > now) {
			this.throwBadRequest(
				'PROMO_CODE_NOT_STARTED',
				'errors.promoCode.notStarted'
			)
		}

		if (promo.expiresAt && promo.expiresAt < now) {
			this.throwBadRequest('PROMO_CODE_EXPIRED', 'errors.promoCode.expired')
		}

		if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
			this.throwBadRequest(
				'PROMO_CODE_LIMIT_REACHED',
				'errors.promoCode.limitReached'
			)
		}

		if (promo.minOrderAmount !== null && subtotal < promo.minOrderAmount) {
			this.throwBadRequest(
				'PROMO_CODE_MIN_ORDER_AMOUNT',
				'errors.promoCode.minOrderAmount'
			)
		}
	}

	private validateCreateDto(dto: CreatePromoCodeDto) {
		if (dto.startsAt && dto.expiresAt) {
			const startsAt = new Date(dto.startsAt)
			const expiresAt = new Date(dto.expiresAt)

			if (expiresAt <= startsAt) {
				this.throwBadRequest(
					'PROMO_CODE_INVALID_DATE_RANGE',
					'errors.promoCode.invalidDateRange'
				)
			}
		}
	}

	private normalizeCode(code: string) {
		return code.trim().toUpperCase()
	}

	private generateCode() {
		return `SALE-${randomBytes(3).toString('hex').toUpperCase()}`
	}

	private throwBadRequest(code: string, message: string): never {
		throw new BadRequestException({ code, message })
	}

	private throwNotFound(code: string, message: string): never {
		throw new NotFoundException({ code, message })
	}
}
