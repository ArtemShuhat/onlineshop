'use client'

import {
	getOverallMetrics,
	getPeriodStats,
	getTopProducts
} from '@entities/analytics'
import { Loading } from '@shared/ui'
import { useQuery } from '@tanstack/react-query'
import { MetricCard, StatsChart, TopProductsSection } from '@widgets/analytics'
import {
	BarChart3,
	DollarSign,
	Eye,
	ShoppingBag,
	ShoppingCart,
	TrendingUp
} from 'lucide-react'
import Link from 'next/link'

type AnalyticsPeriod = '7d' | '30d' | '90d'

type Props = {
	period: AnalyticsPeriod
}

function getPeriodRange(period: AnalyticsPeriod) {
	const endDate = new Date()
	const startDate = new Date()

	if (period === '7d') startDate.setDate(startDate.getDate() - 7)
	if (period === '30d') startDate.setDate(startDate.getDate() - 30)
	if (period === '90d') startDate.setDate(startDate.getDate() - 90)

	return {
		startDate: startDate.toISOString().split('T')[0],
		endDate: endDate.toISOString().split('T')[0]
	}
}

export function AnalyticsPageClient({ period }: Props) {
	const { startDate, endDate } = getPeriodRange(period)

	const { data, isLoading, isError } = useQuery({
		queryKey: ['admin-analytics', period, startDate, endDate],
		queryFn: async () => {
			const [metrics, periodStats, topViews, topSales, topRevenue] =
				await Promise.all([
					getOverallMetrics(),
					getPeriodStats(startDate, endDate),
					getTopProducts('views', 10),
					getTopProducts('sales', 10),
					getTopProducts('revenue', 10)
				])

			return { metrics, periodStats, topViews, topSales, topRevenue }
		}
	})

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loading />
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div className='rounded-lg border border-red-200 bg-red-50 p-6 text-red-700'>
				Не удалось загрузить аналитические данные
			</div>
		)
	}

	const { metrics, periodStats, topViews, topSales, topRevenue } = data

	return (
		<div className='min-h-screen p-8'>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-8 flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>Аналитика</h1>
						<p className='mt-1 text-sm text-gray-500'>
							За последние{' '}
							{period === '7d' ? '7' : period === '30d' ? '30' : '90'} дней
						</p>
					</div>

					<div className='flex gap-2'>
						<Link
							href='?period=7d'
							className='rounded-md border px-3 py-1.5 text-sm'
						>
							7 дн.
						</Link>
						<Link
							href='?period=30d'
							className='rounded-md border px-3 py-1.5 text-sm'
						>
							30 дн.
						</Link>
						<Link
							href='?period=90d'
							className='rounded-md border px-3 py-1.5 text-sm'
						>
							90 дн.
						</Link>
					</div>
				</div>

				<div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<MetricCard
						title='Уникальные просмотры'
						value={metrics.totalViews.toLocaleString()}
						icon={Eye}
						description='Уникальные посетители товаров'
						color='blue'
					/>
					<MetricCard
						title='Заказы'
						value={metrics.totalOrders.toLocaleString()}
						icon={ShoppingBag}
						description='Оплаченные заказы'
						color='green'
					/>
					<MetricCard
						title='Выручка'
						value={`$${metrics.totalRevenue.toLocaleString()}`}
						icon={DollarSign}
						description='Общий объём продаж'
						color='orange'
					/>
					<MetricCard
						title='Добавления в корзину'
						value={metrics.totalAddToCart.toLocaleString()}
						icon={ShoppingCart}
						description='Товары, добавленные в корзину'
						color='purple'
					/>
					<MetricCard
						title='Конверсия'
						value={`${metrics.conversionRate.toFixed(2)}%`}
						icon={TrendingUp}
						description='Просмотры в заказы'
						color='green'
					/>
					<MetricCard
						title='Конверсия в корзину'
						value={`${metrics.addToCartRate.toFixed(2)}%`}
						icon={BarChart3}
						description='Просмотры в корзину'
						color='blue'
					/>
				</div>

				<div className='mb-8'>
					<StatsChart data={periodStats.chartData} />
				</div>

				<TopProductsSection
					viewsData={topViews}
					salesData={topSales}
					revenueData={topRevenue}
				/>
			</div>
		</div>
	)
}
