'use client'

import { api } from '@shared/api'
import { Button } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type AnalyticsPeriod = '7d' | '30d' | '90d'

interface AnalyticsControlsProps {
	period: AnalyticsPeriod
}

export function AnalyticsControls({ period }: AnalyticsControlsProps) {
	const t = useTranslations('analyticsToasts')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	const handlePeriodChange = (nextPeriod: AnalyticsPeriod) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('period', nextPeriod)

		startTransition(() => {
			router.replace(`${pathname}?${params.toString()}`)
		})
	}

	const handleAggregation = async () => {
		try {
			await api.post('analytics/aggregate')
			toast.success(t('aggregationCompleted'))
			router.refresh()
		} catch (error) {
			const message =
				error instanceof Error ? error.message : t('aggregationFailed')
			toast.error(message)
		}
	}

	return (
		<div className='flex gap-2'>
			<Button
				variant={period === '7d' ? 'default' : 'outline'}
				onClick={() => handlePeriodChange('7d')}
				size='sm'
				disabled={isPending}
			>
				7 days
			</Button>
			<Button
				variant={period === '30d' ? 'default' : 'outline'}
				onClick={() => handlePeriodChange('30d')}
				size='sm'
				disabled={isPending}
			>
				30 days
			</Button>
			<Button
				variant={period === '90d' ? 'default' : 'outline'}
				onClick={() => handlePeriodChange('90d')}
				size='sm'
				disabled={isPending}
			>
				90 days
			</Button>
			<Button variant='destructive' onClick={handleAggregation} size='sm'>
				Re-aggregate
			</Button>
		</div>
	)
}
