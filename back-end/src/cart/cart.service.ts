import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import IORedis from 'ioredis'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class CartService {
	private redis: IORedis

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {
		this.redis = new IORedis(this.config.getOrThrow('REDIS_URI'))
	}

	private getCartKey(userId: string): string {
		return `cart:user:${userId}`
	}

	async getCart(userId: string) {
		const key = this.getCartKey(userId)
		const data = await this.redis.get(key)

		if (!data) {
			return { items: [], total: 0 }
		}

		const cart = JSON.parse(data)
		return this.calculateTotal(cart)
	}

	async addItem(userId: string, productId: number, quantity: number) {
		const product = await this.prisma.product.findUnique({
			where: { id: productId },
			include: {
				productImages: {
					where: { isMain: true },
					take: 1
				}
			}
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		if (product.quantity === 0) {
			throw new ConflictException('Товар закончился')
		}

		const cart = await this.getCart(userId)
		const existingItem = cart.items.find(item => item.productId === productId)

		const newQuantityInCart = existingItem
			? existingItem.quantity + quantity
			: quantity

		if (newQuantityInCart > product.quantity) {
			throw new ConflictException(
				`Недостаточно товара на складе. Доступно: ${product.quantity} шт., в корзине уже ${existingItem?.quantity || 0} шт.`
			)
		}

		if (existingItem) {
			existingItem.quantity += quantity
		} else {
			cart.items.push({
				productId,
				quantity,
				price: product.price,
				name: product.name,
				image: product.productImages[0]?.url || null
			})
		}

		await this.saveCart(userId, cart)
		return this.calculateTotal(cart)
	}

	async updateItem(userId: string, productId: number, quantity: number) {
		const product = await this.prisma.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		if (quantity > product.quantity) {
			throw new ConflictException(
				`Недостаточно товара на сладе. Доступно: ${product.quantity} шт.`
			)
		}

		const cart = await this.getCart(userId)

		if (quantity === 0) {
			cart.items = cart.items.filter(item => item.productId !== productId)
		} else {
			const item = cart.items.find(item => item.productId === productId)
			if (item) {
				item.quantity = quantity
			}
		}

		await this.saveCart(userId, cart)
		return this.calculateTotal(cart)
	}

	async removeItem(userId: string, productId: number) {
		const cart = await this.getCart(userId)
		cart.items = cart.items.filter(item => item.productId !== productId)

		await this.saveCart(userId, cart)
		return this.calculateTotal(cart)
	}

	async clearCart(userId: string) {
		const key = this.getCartKey(userId)
		await this.redis.del(key)
		return { items: [], total: 0 }
	}

	async mergeCart(userId: string, localItems: any[]) {
		const serverCart = await this.getCart(userId)

		for (const localItem of localItems) {
			const existing = serverCart.items.find(
				i => i.productId === localItem.productId
			)

			if (existing) {
				existing.quantity += localItem.quantity
			} else {
				serverCart.items.push(localItem)
			}
		}

		await this.saveCart(userId, serverCart)
		return this.calculateTotal(serverCart)
	}

	private async saveCart(userId: string, cart: any) {
		const key = this.getCartKey(userId)
		await this.redis.set(key, JSON.stringify(cart), 'EX', 60 * 60 * 24 * 30)
	}

	private calculateTotal(cart: any) {
		const total = cart.items.reduce((sum, item) => {
			return sum + item.price * item.quantity
		}, 0)

		return { ...cart, total }
	}
}
