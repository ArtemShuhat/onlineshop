import {
	getOverallMetrics,
	getPeriodStats,
	getTopProducts
} from '@entities/analytics'
import { getServerCookieHeader } from '@shared/lib/getServerCookieHeader'
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

export const dynamic = 'force-dynamic'

type AnalyticsPeriod = '7d' | '30d' | '90d'

type Props = {
	searchParams: Promise<{ period?: string }>
}

function parsePeriod(period?: string): AnalyticsPeriod {
	if (period === '7d' || period === '90d') return period
	return '30d'
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

export default async function AnalyticsPage({ searchParams }: Props) {
	const { period: periodParam } = await searchParams
	const period = parsePeriod(periodParam)
	const { startDate, endDate } = getPeriodRange(period)

	const cookieHeader = await getServerCookieHeader()
	const requestOptions = {
		cache: 'no-store' as const,
		...(cookieHeader.cookie ? { headers: { cookie: cookieHeader.cookie } } : {})
	}

	try {
		const [metrics, periodStats, topViews, topSales, topRevenue] =
			await Promise.all([
				getOverallMetrics(requestOptions),
				getPeriodStats(startDate, endDate, requestOptions),
				getTopProducts('views', 10, requestOptions),
				getTopProducts('sales', 10, requestOptions),
				getTopProducts('revenue', 10, requestOptions)
			])

		return (
			<div className='min-h-screen p-8'>
				<div className='mx-auto max-w-7xl'>
					<div className='mb-8 flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>Analytics</h1>
							<p className='mt-1 text-sm text-gray-500'>
								Last {period === '7d' ? '7' : period === '30d' ? '30' : '90'}{' '}
								days
							</p>
						</div>

						<div className='flex gap-2'>
							<Link
								href='?period=7d'
								className='rounded-md border px-3 py-1.5 text-sm'
							>
								7d
							</Link>
							<Link
								href='?period=30d'
								className='rounded-md border px-3 py-1.5 text-sm'
							>
								30d
							</Link>
							<Link
								href='?period=90d'
								className='rounded-md border px-3 py-1.5 text-sm'
							>
								90d
							</Link>
						</div>
					</div>

					<div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						<MetricCard
							title='Unique Views'
							value={metrics.totalViews.toLocaleString()}
							icon={Eye}
							description='Unique product visitors'
							color='blue'
						/>
						<MetricCard
							title='Orders'
							value={metrics.totalOrders.toLocaleString()}
							icon={ShoppingBag}
							description='Paid orders'
							color='green'
						/>
						<MetricCard
							title='Revenue'
							value={`$${metrics.totalRevenue.toLocaleString()}`}
							icon={DollarSign}
							description='Total sales volume'
							color='orange'
						/>
						<MetricCard
							title='Add to Cart'
							value={metrics.totalAddToCart.toLocaleString()}
							icon={ShoppingCart}
							description='Items added to cart'
							color='purple'
						/>
						<MetricCard
							title='Conversion'
							value={`${metrics.conversionRate.toFixed(2)}%`}
							icon={TrendingUp}
							description='Views to orders'
							color='green'
						/>
						<MetricCard
							title='Add-to-Cart Rate'
							value={`${metrics.addToCartRate.toFixed(2)}%`}
							icon={BarChart3}
							description='Views to cart'
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
	} catch {
		return (
			<div className='rounded-lg border border-red-200 bg-red-50 p-6 text-red-700'>
				Failed to load analytics data
			</div>
		)
	}
}
