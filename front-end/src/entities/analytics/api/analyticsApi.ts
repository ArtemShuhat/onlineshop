import { OverallMetrics, PeriodStats, TopProduct } from '@entities/analytics'
import { api } from '@shared/api'

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
