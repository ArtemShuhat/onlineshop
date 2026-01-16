'use client'

import { getUserOrders } from '@entities/order'
import { OrderCard } from '@entities/order'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@widgets/header'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
	const router = useRouter()

	const { data: orders, isLoading } = useQuery({
		queryKey: ['orders'],
		queryFn: getUserOrders
	})

	return (
		<>
			<Header />
			<div className='mx-auto min-h-screen max-w-6xl px-4 py-12'>
				<h1 className='mb-8 text-3xl font-bold text-center'>Мои заказы</h1>

				{isLoading ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{[1, 2, 3, 4].map(i => (
							<div
								key={i}
								className='h-64 animate-pulse rounded-lg bg-gray-200'
							/>
						))}
					</div>
				) : orders && orders.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{orders.map(order => (
							<OrderCard
								key={order.id}
								order={order}
								onClick={() => router.push(`/orders/${order.id}`)}
							/>
						))}
					</div>
				) : (
					<div className='py-20 text-center'>
						<p className='text-xl text-gray-500'>У вас еще нет заказов</p>
					</div>
				)}
			</div>
		</>
	)
}
