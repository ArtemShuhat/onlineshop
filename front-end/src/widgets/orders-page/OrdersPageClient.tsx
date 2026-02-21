'use client'

import { type Order, OrderCard } from '@entities/order'
import { Package, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
	initialOrders: Order[]
}

export function OrdersPageClient({ initialOrders }: Props) {
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
						РњРѕРё Р·Р°РєР°Р·С‹
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
					<div className='mx-auto max-w-md rounded-2xl bg-white p-12 text-center shadow-sm'>
						<ShoppingBag className='mx-auto h-16 w-16 text-gray-400' />
						<h2 className='mt-4 text-2xl font-bold text-gray-900'>
							Р—Р°РєР°Р·РѕРІ РїРѕРєР° РЅРµС‚
						</h2>
					</div>
				)}
			</div>
		</div>
	)
}
