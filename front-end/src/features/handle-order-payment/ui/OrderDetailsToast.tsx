'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
	orderId: number
}

export function OrderDetailsToast({ orderId }: Props) {
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const success = searchParams.get('success')
		const canceled = searchParams.get('canceled')
		const key = `toast-order-${orderId}`

		if (success === 'true' && !sessionStorage.getItem(key)) {
			toast.success('Оплата прошла успешно!')
			sessionStorage.setItem(key, 'true')
			router.replace(`/orders/${orderId}`)
		}

		if (canceled === 'true' && !sessionStorage.getItem(key)) {
			toast.error('Оплата была отменена')
			sessionStorage.setItem(key, 'true')
			router.replace(`/orders/${orderId}`)
		}
	}, [orderId, router, searchParams])

	return null
}
