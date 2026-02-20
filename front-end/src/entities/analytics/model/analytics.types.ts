import { ProductImage } from "@entities/product"

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
	priceUSD: number
	priceEUR: number
	priceUAH: number
	productImages: ProductImage[]
	totalViews: number
	totalSold: number
	totalRevenue: number
	category: {
		name: string
	} | null
}
