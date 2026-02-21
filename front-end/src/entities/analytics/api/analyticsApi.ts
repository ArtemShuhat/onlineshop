import {
	type OverallMetrics,
	type PeriodStats,
	type TopProduct
} from '@entities/analytics'
import { api } from '@shared/api'
import { type RequestOptions } from '@shared/utils'

type AnalyticsRequestOptions = Omit<
	RequestOptions,
	'params' | 'body' | 'method'
>

export async function getOverallMetrics(
	options?: AnalyticsRequestOptions
): Promise<OverallMetrics> {
	return api.get<OverallMetrics>('analytics/overview', options)
}

export async function getPeriodStats(
	startDate: string,
	endDate: string,
	options?: AnalyticsRequestOptions
): Promise<PeriodStats> {
	return api.get<PeriodStats>('analytics/period', {
		...options,
		params: { startDate, endDate }
	})
}

export async function getTopProducts(
	metric: 'views' | 'sales' | 'revenue' = 'views',
	limit: number = 10,
	options?: AnalyticsRequestOptions
): Promise<TopProduct[]> {
	return api.get<TopProduct[]>('analytics/top-products', {
		...options,
		params: { metric, limit }
	})
}
