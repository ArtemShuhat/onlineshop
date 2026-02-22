'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
	orderId: number
}

export function OrderDetailsToast({ orderId }: Props) {
	const t = useTranslations('orderDetailsToast')
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const success = searchParams.get('success')
		const canceled = searchParams.get('canceled')
		const key = `toast-order-${orderId}`

		if (success === 'true' && !sessionStorage.getItem(key)) {
			toast.success(t('paymentSuccess'))
			sessionStorage.setItem(key, 'true')
			router.replace(`/orders/${orderId}`)
		}

		if (canceled === 'true' && !sessionStorage.getItem(key)) {
			toast.error(t('paymentCanceled'))
			sessionStorage.setItem(key, 'true')
			router.replace(`/orders/${orderId}`)
		}
	}, [orderId, router, searchParams, t])

	return null
}
