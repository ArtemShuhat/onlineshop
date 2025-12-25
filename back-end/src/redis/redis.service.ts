import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: Redis

	onModuleInit() {
		this.client = new Redis({
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT || '6379'),
			password: process.env.REDIS_PASSWORD || undefined,
			retryStrategy: times => {
				const delay = Math.min(times * 50, 2000)
				return delay
			}
		})

		this.client.on('connect', () => {
			console.log('Redis успешно подключен')
		})

		this.client.on('error', err => {
			console.error('Ошибка подключения Redis:', err)
		})
	}

	onModuleDestroy() {
		this.client.disconnect()
	}

	getClient(): Redis {
		return this.client
	}

	async trackUniqueView(
		productId: number,
		identifier: string
	): Promise<boolean> {
		const key = `view:${productId}:${identifier}`
		const exists = await this.client.exists(key)

		if (exists) {
			return false
		}

		await this.client.setex(key, 30 * 60, '1')
		return true
	}

	async incrementViewCounter(productId: number, isUnique: boolean) {
		const today = new Date().toISOString().split('T')[0]
		const totalKey = `views:${productId}:${today}:total`
		const uniqueKey = `views:${productId}:${today}:unique`

		await this.client.incr(totalKey)
		if (isUnique) {
			await this.client.incr(uniqueKey)
		}

		await this.client.expire(totalKey, 48 * 60 * 60)
		await this.client.expire(uniqueKey, 48 * 60 * 60)
	}

	async incrementAddToCart(productId: number) {
		const today = new Date().toISOString().split('T')[0]
		const key = `cart:${productId}:${today}`

		await this.client.incr(key)
		await this.client.expire(key, 48 * 60 * 60)
	}

	async getViewsData(
		date: string
	): Promise<Map<number, { total: number; unique: number }>> {
		const pattern = `views:*:${date}:*`
		const keys = await this.client.keys(pattern)

		const data = new Map<number, { total: number; unique: number }>()

		for (const key of keys) {
			const parts = key.split(':')
			const productId = parseInt(parts[1])
			const type = parts[3]
			const value = parseInt((await this.client.get(key)) || '0')

			if (!data.has(productId)) {
				data.set(productId, { total: 0, unique: 0 })
			}

			const stats = data.get(productId)!
			if (type === 'total') {
				stats.total = value
			} else if (type === 'unique') {
				stats.unique = value
			}
		}

		return data
	}

	async getAddToCartData(date: string): Promise<Map<number, number>> {
		const pattern = `cart:*:${date}`
		const keys = await this.client.keys(pattern)

		const data = new Map<number, number>()

		for (const key of keys) {
			const productId = parseInt(key.split(':')[1])
			const count = parseInt((await this.client.get(key)) || '0')
			data.set(productId, count)
		}

		return data
	}

	async clearAggregatedData(date: string) {
		const patterns = [`views:*:${date}:*`, `cart:*:${date}`]

		for (const pattern of patterns) {
			const keys = await this.client.keys(pattern)
			if (keys.length > 0) {
				await this.client.del(...keys)
			}
		}
	}
}
