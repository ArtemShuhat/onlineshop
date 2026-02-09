'use client'

import { type Order, getUserOrders } from '@entities/order'
import { OrderCard } from '@entities/order'
import { useQuery } from '@tanstack/react-query'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { Package, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
	const router = useRouter()

	const { data: orders, isLoading } = useQuery<Order[]>({
		queryKey: ['orders'],
		queryFn: getUserOrders
	})

	return (
		<>
			<Header />

			<div className='min-h-screen'>
				<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
					<div className='mb-12 text-center'>
						<div className='mb-4 flex justify-center'>
							<div className='rounded-2xl bg-blue-100 p-4'>
								<Package className='h-10 w-10 text-blue-600' />
							</div>
						</div>
						<h1 className='mb-3 text-4xl font-bold tracking-tight text-gray-900'>
							Мои заказы
						</h1>
						<p className='text-lg text-gray-600'>
							История ваших покупок и статус доставки
						</p>
					</div>

					{isLoading ? (
						<div className='grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2'>
							{[1, 2, 3, 4].map(i => (
								<div
									key={i}
									className='h-72 animate-pulse rounded-2xl bg-white shadow-sm'
								>
									<div className='p-6'>
										<div className='mb-4 h-6 w-32 rounded bg-gray-200' />
										<div className='mb-6 h-4 w-24 rounded bg-gray-200' />
										<div className='space-y-3'>
											<div className='flex gap-3'>
												<div className='h-14 w-14 rounded-lg bg-gray-200' />
												<div className='flex-1'>
													<div className='mb-2 h-4 w-3/4 rounded bg-gray-200' />
													<div className='h-3 w-1/2 rounded bg-gray-200' />
												</div>
											</div>
											<div className='flex gap-3'>
												<div className='h-14 w-14 rounded-lg bg-gray-200' />
												<div className='flex-1'>
													<div className='mb-2 h-4 w-3/4 rounded bg-gray-200' />
													<div className='h-3 w-1/2 rounded bg-gray-200' />
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : orders && orders.length > 0 ? (
						<>
							<div className='mb-6 flex items-center justify-between'>
								<p className='text-sm font-medium text-gray-700'>
									Всего заказов:{' '}
									<span className='text-lg font-bold text-gray-900'>
										{orders.length}
									</span>
								</p>
							</div>
							<div className='grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2'>
								{orders.map(order => (
									<OrderCard
										key={order.id}
										order={order}
										onClick={() => router.push(`/orders/${order.id}`)}
									/>
								))}
							</div>
						</>
					) : (
						<div className='mx-auto max-w-md rounded-2xl bg-white p-12 text-center shadow-sm'>
							<div className='mb-6 flex justify-center'>
								<div className='rounded-full bg-gray-100 p-6'>
									<ShoppingBag className='h-16 w-16 text-gray-400' />
								</div>
							</div>
							<h2 className='mb-3 text-2xl font-bold text-gray-900'>
								Заказов пока нет
							</h2>
							<p className='mb-8 text-gray-600'>
								Начните делать покупки, чтобы увидеть здесь свои заказы
							</p>
							<button
								onClick={() => router.push('/')}
								className='rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40'
							>
								Начать покупки
							</button>
						</div>
					)}
				</div>
			</div>

			<Footer />
		</>
	)
}
