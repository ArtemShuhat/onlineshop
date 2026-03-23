'use client'

import { useOrderById } from '@entities/order'
import { OrderDetailsToast } from '@features/handle-order-payment'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

import { OrderDetailsContent } from './OrderDetailsContent'
import { OrderDetailsSkeleton } from './OrderDetailsSkeleton'

type Props = {
	orderId: number
}

export function OrderDetailsPageClient({ orderId }: Props) {
	const { data: order, isLoading, isError } = useOrderById(orderId)

	if (isLoading) {
		return <OrderDetailsSkeleton />
	}

	if (isError || !order) {
		return (
			<div className='flex min-h-[70vh] items-center justify-center px-4'>
				<div className='text-center'>
					<XCircle className='mx-auto h-10 w-10 text-red-600' />
					<h1 className='mb-6 mt-4 text-2xl font-bold text-gray-900'>
						Заказ не найден
					</h1>
					<Link
						href='/orders'
						className='inline-flex rounded-full bg-pur px-6 py-3 text-white'
					>
						Вернуться к заказам
					</Link>
				</div>
			</div>
		)
	}

	return (
		<>
			<OrderDetailsToast orderId={orderId} />
			<OrderDetailsContent order={order} />
		</>
	)
}
