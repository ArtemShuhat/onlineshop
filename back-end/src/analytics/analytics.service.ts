import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/prisma/prisma.service'
import { RedisService } from '@/redis/redis.service'

@Injectable()
export class AnalyticsService {
	private readonly logger = new Logger(AnalyticsService.name)

	constructor(
		private readonly prisma: PrismaService,
		private readonly redis: RedisService
	) {}

	async trackProductView(productId: number, identifier: string) {
		try {
			const isUnique = await this.redis.trackUniqueView(productId, identifier)
			await this.redis.incrementViewCounter(productId, isUnique)
		} catch (error) {
			this.logger.error(`Отслеживание ошибок для продукта ${productId}:`, error)
		}
	}

	async trackAddToCart(productId: number) {
		try {
			await this.redis.incrementAddToCart(productId)
		} catch (error) {
			this.logger.error(
				`Отслеживание ошибок "добавления товара" для продукта ${productId}:`,
				error
			)
		}
	}

	@Cron('5 0 * * *')
	async aggregateDailyStats() {
		this.logger.log('Начало агрегирования ежедневной статистики...')

		const yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)
		const dateStr = yesterday.toISOString().split('T')[0]
		const date = new Date(dateStr)

		try {
			//Получить данные из Redis
			const viewsData = await this.redis.getViewsData(dateStr)
			const cartData = await this.redis.getAddToCartData(dateStr)

			//Получить данные о продажах из БД
			const salesData = await this.getSalesDataForDate(date)

			//Агрегировать по товарам
			await this.aggregateProductStats(date, viewsData, cartData, salesData)

			//Агрегировать общую статистику
			await this.aggregateGlobalStats(date, viewsData, cartData, salesData)

			//Обновить кэшированные метрики товаров
			await this.updateProductCachedMetrics()

			//Очистить Redis
			await this.redis.clearAggregatedData(dateStr)

			this.logger.log(
				`Завершено агрегирование ежедневной статистики для ${dateStr}`
			)
		} catch (error) {
			this.logger.error(
				'Ошибка при агрегировании ежедневной статистики:',
				error
			)
		}
	}

	private async getSalesDataForDate(date: Date) {
		const nextDay = new Date(date)
		nextDay.setDate(nextDay.getDate() + 1)

		const orders = await this.prisma.order.findMany({
			where: {
				status: 'PAYED',
				createdAt: {
					gte: date,
					lt: nextDay
				}
			},
			include: {
				orderItems: true
			}
		})

		const salesByProduct = new Map<
			number,
			{ count: number; quantity: number; revenue: number }
		>()

		for (const order of orders) {
			for (const item of order.orderItems) {
				if (!salesByProduct.has(item.productId)) {
					salesByProduct.set(item.productId, {
						count: 0,
						quantity: 0,
						revenue: 0
					})
				}

				const stats = salesByProduct.get(item.productId)!
				stats.count += 1
				stats.quantity += item.quantity
				stats.revenue += item.amountItem
			}
		}

		return {
			ordersByProduct: salesByProduct,
			totalOrders: orders.length,
			totalItems: orders.reduce(
				(sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0),
				0
			),
			totalRevenue: orders.reduce(
				(sum, o) => sum + o.orderItems.reduce((s, i) => s + i.amountItem, 0),
				0
			)
		}
	}

	private async aggregateProductStats(
		date: Date,
		viewsData: Map<number, { total: number; unique: number }>,
		cartData: Map<number, number>,
		salesData: any
	) {
		const allProductIds = new Set([
			...viewsData.keys(),
			...cartData.keys(),
			...salesData.ordersByProduct.keys()
		])

		for (const productId of allProductIds) {
			const views = viewsData.get(productId) || { total: 0, unique: 0 }
			const addToCart = cartData.get(productId) || 0
			const sales = salesData.ordersByProduct.get(productId) || {
				count: 0,
				quantity: 0,
				revenue: 0
			}

			await this.prisma.productDailyStats.upsert({
				where: {
					productId_date: {
						productId,
						date
					}
				},
				create: {
					productId,
					date,
					totalViews: views.total,
					uniqueViews: views.unique,
					addToCartCount: addToCart,
					orderCount: sales.count,
					quantitySold: sales.quantity,
					revenue: sales.revenue
				},
				update: {
					totalViews: views.total,
					uniqueViews: views.unique,
					addToCartCount: addToCart,
					orderCount: sales.count,
					quantitySold: sales.quantity,
					revenue: sales.revenue
				}
			})
		}
	}

	private async aggregateGlobalStats(
		date: Date,
		viewsData: Map<number, { total: number; unique: number }>,
		cartData: Map<number, number>,
		salesData: any
	) {
		const totalViews = Array.from(viewsData.values()).reduce(
			(sum, v) => sum + v.total,
			0
		)
		const totalUniqueViews = Array.from(viewsData.values()).reduce(
			(sum, v) => sum + v.unique,
			0
		)
		const totalAddToCart = Array.from(cartData.values()).reduce(
			(sum, c) => sum + c,
			0
		)

		await this.prisma.dailyStats.upsert({
			where: { date },
			create: {
				date,
				totalViews,
				totalUniqueViews,
				addToCartCount: totalAddToCart,
				ordersCount: salesData.totalOrders,
				itemsSold: salesData.totalItems,
				revenue: salesData.totalRevenue
			},
			update: {
				totalViews,
				totalUniqueViews,
				addToCartCount: totalAddToCart,
				ordersCount: salesData.totalOrders,
				itemsSold: salesData.totalItems,
				revenue: salesData.totalRevenue
			}
		})
	}

	private async updateProductCachedMetrics() {
		const products = await this.prisma.product.findMany({
			include: {
				dailyStats: {
					select: {
						uniqueViews: true,
						quantitySold: true,
						revenue: true
					}
				}
			}
		})

		for (const product of products) {
			const totalViews = product.dailyStats.reduce(
				(sum, s) => sum + s.uniqueViews,
				0
			)
			const totalSold = product.dailyStats.reduce(
				(sum, s) => sum + s.quantitySold,
				0
			)
			const totalRevenue = product.dailyStats.reduce(
				(sum, s) => sum + s.revenue,
				0
			)

			await this.prisma.product.update({
				where: { id: product.id },
				data: {
					totalViews,
					totalSold,
					totalRevenue
				}
			})
		}
	}

	async getStatsForPeriod(startDate: Date, endDate: Date) {
		const stats = await this.prisma.dailyStats.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			orderBy: { date: 'asc' }
		})

		const totals = stats.reduce(
			(acc, s) => ({
				totalViews: acc.totalViews + s.totalUniqueViews,
				ordersCount: acc.ordersCount + s.ordersCount,
				itemsSold: acc.itemsSold + s.itemsSold,
				revenue: acc.revenue + s.revenue,
				addToCartCount: acc.addToCartCount + s.addToCartCount
			}),
			{
				totalViews: 0,
				ordersCount: 0,
				itemsSold: 0,
				revenue: 0,
				addToCartCount: 0
			}
		)

		const conversionRate =
			totals.totalViews > 0 ? (totals.ordersCount / totals.totalViews) * 100 : 0

		return {
			chartData: stats.map(s => ({
				date: s.date.toISOString().split('T')[0],
				views: s.totalUniqueViews,
				orders: s.ordersCount,
				revenue: s.revenue
			})),
			totals: {
				...totals,
				conversionRate: parseFloat(conversionRate.toFixed(2))
			}
		}
	}

	async getTopProducts(metric: 'views' | 'sales' | 'revenue', limit = 10) {
		const orderBy =
			metric === 'views'
				? { totalViews: 'desc' as const }
				: metric === 'sales'
					? { totalSold: 'desc' as const }
					: { totalRevenue: 'desc' as const }

		return await this.prisma.product.findMany({
			take: limit,
			where: {
				OR: [
					{ totalViews: { gt: 0 } },
					{ totalSold: { gt: 0 } },
					{ totalRevenue: { gt: 0 } }
				]
			},
			orderBy,
			select: {
				id: true,
				name: true,
				slug: true,
				price: true,
				images: true,
				totalViews: true,
				totalSold: true,
				totalRevenue: true,
				category: {
					select: {
						name: true
					}
				}
			}
		})
	}

	async getOverallMetrics() {
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		const stats = await this.prisma.dailyStats.findMany({
			where: {
				date: { gte: thirtyDaysAgo }
			}
		})

		const totalViews = stats.reduce((sum, s) => sum + s.totalUniqueViews, 0)
		const totalOrders = stats.reduce((sum, s) => sum + s.ordersCount, 0)
		const totalRevenue = stats.reduce((sum, s) => sum + s.revenue, 0)
		const totalAddToCart = stats.reduce((sum, s) => sum + s.addToCartCount, 0)

		const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0
		const addToCartRate =
			totalViews > 0 ? (totalAddToCart / totalViews) * 100 : 0

		return {
			totalViews,
			totalOrders,
			totalRevenue,
			totalAddToCart,
			conversionRate: parseFloat(conversionRate.toFixed(2)),
			addToCartRate: parseFloat(addToCartRate.toFixed(2))
		}
	}
}
