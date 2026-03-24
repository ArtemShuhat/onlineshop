import { AnalyticsPageClient } from './AnalyticsPageClient'

export const dynamic = 'force-dynamic'

type AnalyticsPeriod = '7d' | '30d' | '90d'

type Props = {
	searchParams: Promise<{ period?: string }>
}

function parsePeriod(period?: string): AnalyticsPeriod {
	if (period === '7d' || period === '90d') return period
	return '30d'
}

export default async function AnalyticsPage({ searchParams }: Props) {
	const { period: periodParam } = await searchParams
	const period = parsePeriod(periodParam)

	return <AnalyticsPageClient period={period} />
}
