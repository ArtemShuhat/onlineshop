'use client'

import { useOrderById } from '@entities/order'
import {
	OrderDetailsContent,
	OrderDetailsSkeleton
} from '@features/order-details'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { XCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function OrderDetailsPage() {
	const params = useParams()
	const orderId = Number(params.id)
	const searchParams = useSearchParams()
	const router = useRouter()

	const { data: order, isLoading, error } = useOrderById(orderId)
	const success = searchParams.get('success')
	const canceled = searchParams.get('canceled')

	useEffect(() => {
		const toastShown = sessionStorage.getItem(`toast-order-${orderId}`)

		if (success === 'true' && !toastShown) {
			toast.success('Оплата прошла успешно! 🎉')
			sessionStorage.setItem(`toast-order-${orderId}`, 'true')
			router.replace(`/orders/${orderId}`)
		} else if (canceled === 'true' && !toastShown) {
			toast.error('Оплата была отменена')
			sessionStorage.setItem(`toast-order-${orderId}`, 'true')
			router.replace(`/orders/${orderId}`)
		}
	}, [success, canceled, orderId, router])

	if (isLoading) {
		return (
			<>
				<Header />
				<OrderDetailsSkeleton />
				<Footer />
			</>
		)
	}

	if (error || !order) {
		return (
			<>
				<Header />
				<div className='flex min-h-[70vh] items-center justify-center px-4'>
					<div className='text-center'>
						<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
							<XCircle className='h-10 w-10 text-red-600' />
						</div>
						<h1 className='mb-2 text-2xl font-bold text-gray-900'>
							Заказ не найден
						</h1>
						<p className='mb-6 text-gray-600'>
							Возможно, заказ был удален или вы ввели неверный ID
						</p>
						<Link
							href='/orders'
							className='inline-flex items-center gap-2 rounded-full bg-pur px-6 py-3 font-medium text-white transition hover:bg-purh'
						>
							← Вернуться к заказам
						</Link>
					</div>
				</div>
				<Footer />
			</>
		)
	}

	return (
		<>
			<Header />
			<OrderDetailsContent order={order} />
			<Footer />
		</>
	)
}
