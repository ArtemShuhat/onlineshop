'use client'

import {
	type OverallMetrics,
	type PeriodStats,
	type TopProduct,
	getOverallMetrics,
	getPeriodStats,
	getTopProducts
} from '@entities/api/analyticsApi'
import { api } from '@shared/api'
import { AdminSidebar } from '@widgets/admin-sidebar/AdminSidebar'
import { MetricCard } from '@widgets/analytics/MetricCard'
import { StatsChart } from '@widgets/analytics/StatsChart'
import { TopProductsSection } from '@widgets/analytics/TopProductsTable'
import {
	BarChart3,
	DollarSign,
	Eye,
	ShoppingBag,
	ShoppingCart,
	TrendingUp
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, Skeleton } from '@/shared/ui'

export default function AnalyticsPage() {
	const [metrics, setMetrics] = useState<OverallMetrics | null>(null)
	const [periodStats, setPeriodStats] = useState<PeriodStats | null>(null)
	const [topViews, setTopViews] = useState<TopProduct[]>([])
	const [topSales, setTopSales] = useState<TopProduct[]>([])
	const [topRevenue, setTopRevenue] = useState<TopProduct[]>([])
	const [loading, setLoading] = useState(true)
	const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

	useEffect(() => {
		loadData()
	}, [period])

	const handleAggregation = async () => {
		try {
			const response = await api.post('analytics/aggregate')
			alert('Агрегация выполнена! Обновите страницу.')
			window.location.reload()
		} catch (error) {
			alert('Ошибка агрегации: ' + error.message)
		}
	}
	const loadData = async () => {
		try {
			setLoading(true)

			const endDate = new Date()
			const startDate = new Date()

			switch (period) {
				case '7d':
					startDate.setDate(startDate.getDate() - 7)
					break
				case '30d':
					startDate.setDate(startDate.getDate() - 30)
					break
				case '90d':
					startDate.setDate(startDate.getDate() - 90)
					break
			}

			const [metricsData, periodData, viewsData, salesData, revenueData] =
				await Promise.all([
					getOverallMetrics(),
					getPeriodStats(
						startDate.toISOString().split('T')[0],
						endDate.toISOString().split('T')[0]
					),
					getTopProducts('views', 10),
					getTopProducts('sales', 10),
					getTopProducts('revenue', 10)
				])

			setMetrics(metricsData)
			setPeriodStats(periodData)
			setTopViews(viewsData)
			setTopSales(salesData)
			setTopRevenue(revenueData)
		} catch (error) {
			console.error('Ошибка загрузки аналитики:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<>
				<AdminSidebar />
				<div className='ml-48 p-8'>
					<Skeleton className='mb-8 h-10 w-64' />
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{[1, 2, 3, 4, 5, 6].map(i => (
							<Skeleton key={i} className='h-32' />
						))}
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<AdminSidebar />
			<div className='ml-48 min-h-screen bg-gray-50 p-8'>
				<div className='mx-auto max-w-7xl'>
					<div className='mb-8 flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>Аналитика</h1>
							<p className='mt-1 text-sm text-gray-500'>
								Статистика за последние{' '}
								{period === '7d' ? '7' : period === '30d' ? '30' : '90'} дней
							</p>
						</div>
						<div className='flex gap-2'>
							<Button
								variant={period === '7d' ? 'default' : 'outline'}
								onClick={() => setPeriod('7d')}
								size='sm'
							>
								7 дней
							</Button>
							<Button
								variant={period === '30d' ? 'default' : 'outline'}
								onClick={() => setPeriod('30d')}
								size='sm'
							>
								30 дней
							</Button>
							<Button
								variant={period === '90d' ? 'default' : 'outline'}
								onClick={() => setPeriod('90d')}
								size='sm'
							>
								90 дней
							</Button>
							{/* НОВАЯ КНОПКА */}
							<Button
								variant='destructive'
								onClick={handleAggregation}
								size='sm'
							>
								🔄 Агрегировать данные
							</Button>
						</div>
					</div>

					<div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						<MetricCard
							title='Уникальные просмотры'
							value={metrics?.totalViews.toLocaleString() || '0'}
							icon={Eye}
							description='Уникальных посетителей товаров'
							color='blue'
						/>
						<MetricCard
							title='Заказы'
							value={metrics?.totalOrders.toLocaleString() || '0'}
							icon={ShoppingBag}
							description='Оплаченных заказов'
							color='green'
						/>
						<MetricCard
							title='Выручка'
							value={`$${metrics?.totalRevenue.toLocaleString() || '0'}`}
							icon={DollarSign}
							description='Общая сумма продаж'
							color='orange'
						/>
						<MetricCard
							title='Добавлений в корзину'
							value={metrics?.totalAddToCart.toLocaleString() || '0'}
							icon={ShoppingCart}
							description='Товаров добавлено в корзину'
							color='purple'
						/>
						<MetricCard
							title='Конверсия'
							value={`${metrics?.conversionRate.toFixed(2)}%`}
							icon={TrendingUp}
							description='Просмотры → Заказы'
							color='green'
						/>
						<MetricCard
							title='Add-to-Cart Rate'
							value={`${metrics?.addToCartRate.toFixed(2)}%`}
							icon={BarChart3}
							description='Просмотры → Корзина'
							color='blue'
						/>
					</div>

					{periodStats && (
						<div className='mb-8'>
							<StatsChart data={periodStats.chartData} />
						</div>
					)}

					<TopProductsSection
						viewsData={topViews}
						salesData={topSales}
						revenueData={topRevenue}
					/>
				</div>
			</div>
		</>
	)
}
