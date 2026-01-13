import { ProductImage } from '@entities/product'
import { api } from '@shared/api'

export interface OverallMetrics {
	totalViews: number
	totalOrders: number
	totalRevenue: number
	totalAddToCart: number
	conversionRate: number
	addToCartRate: number
}

export interface ChartDataPoint {
	date: string
	views: number
	orders: number
	revenue: number
}

export interface PeriodStats {
	chartData: ChartDataPoint[]
	totals: {
		totalViews: number
		ordersCount: number
		itemsSold: number
		revenue: number
		addToCartCount: number
		conversionRate: number
	}
}

export interface TopProduct {
	id: number
	name: string
	slug: string
	price: number
	productImages: ProductImage[]
	totalViews: number
	totalSold: number
	totalRevenue: number
	category: {
		name: string
	} | null
}

export async function getOverallMetrics(): Promise<OverallMetrics> {
	return api.get<OverallMetrics>('analytics/overview')
}

export async function getPeriodStats(
	startDate: string,
	endDate: string
): Promise<PeriodStats> {
	return api.get<PeriodStats>('analytics/period', {
		params: { startDate, endDate }
	})
}

export async function getTopProducts(
	metric: 'views' | 'sales' | 'revenue' = 'views',
	limit: number = 10
): Promise<TopProduct[]> {
	return api.get<TopProduct[]>('analytics/top-products', {
		params: { metric, limit }
	})
}
