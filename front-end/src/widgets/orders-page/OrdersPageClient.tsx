'use client'

import { type Order, OrderCard } from '@entities/order'
import { Package, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

type Props = {
	initialOrders: Order[]
}

export function OrdersPageClient({ initialOrders }: Props) {
	const t = useTranslations('ordersPage')
	const router = useRouter()
	const orders = initialOrders

	return (
		<div className='min-h-screen'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
				<div className='mb-12 text-center'>
					<div className='mb-4 flex justify-center'>
						<div className='rounded-2xl bg-blue-100 p-4'>
							<Package className='h-10 w-10 text-blue-600' />
						</div>
					</div>
					<h1 className='mb-3 text-4xl font-bold tracking-tight text-gray-900'>
						{t('title')}
					</h1>
				</div>

				{orders.length > 0 ? (
					<div className='grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2'>
						{orders.map(order => (
							<OrderCard
								key={order.id}
								order={order}
								onClick={() => router.push(`/orders/${order.id}`)}
							/>
						))}
					</div>
				) : (
					<div className='mx-auto max-w-md rounded-2xl bg-gray-50 p-12 text-center shadow-lg'>
						<ShoppingBag className='mx-auto h-16 w-16 text-gray-400' />
						<h2 className='mt-4 text-2xl font-bold text-gray-900'>
							{t('empty')}
						</h2>
					</div>
				)}
			</div>
		</div>
	)
}
