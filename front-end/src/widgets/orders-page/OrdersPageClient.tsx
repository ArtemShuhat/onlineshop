'use client'

import { type Order, OrderCard, getUserOrders } from '@entities/order'
import { Button } from '@shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

type Props = {
	initialOrders: Order[]
}

export function OrdersPageClient({ initialOrders }: Props) {
	const t = useTranslations('ordersPage')
	const router = useRouter()
	const { data: orders = initialOrders, isLoading } = useQuery<Order[]>({
		queryKey: ['user-orders'],
		queryFn: () => getUserOrders()
	})

	if (isLoading && orders.length === 0) {
		return (
			<div className='flex min-h-[70vh] items-center justify-center'>
				<div className='text-center text-gray-600'>{t('title')}...</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<div className='mx-auto max-w-7xl px-4 py-12 max-lg:py-10'>
				{orders.length > 0 ? (
					<>
						<div className='mb-12 flex flex-col items-center gap-4 text-center max-sm:flex-row max-sm:justify-center max-sm:gap-3'>
							<div className='rounded-2xl bg-blue-100 p-4'>
								<Package className='h-10 w-10 text-blue-600' />
							</div>
							<h1 className='text-4xl font-bold tracking-tight text-gray-900'>
								{t('title')}
							</h1>
						</div>
						<div className='grid auto-rows-fr grid-cols-2 gap-6 max-sm:grid-cols-1'>
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
					<div className='flex min-h-[70vh] items-center justify-center'>
						<div className='mx-auto max-w-md rounded-2xl p-12 text-center'>
							<ShoppingBag className='mx-auto h-16 w-16 text-gray-400' />
							<h2 className='mt-4 text-4xl font-bold text-gray-900'>
								{t('empty')}
							</h2>
							<Button className='mt-8 h-12' onClick={() => router.push('/')}>
								{t('firstOrder')}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
