'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useOrderById } from '@/entities/order'
import { OrderStatusBadge } from '@/entities/order'
import Header from '@/widgets/header/Header'
import { getMainProductImage } from '@shared/lib/getProductImages'

export default function OrderDetailsPage() {
	const params = useParams()
	const orderId = Number(params.id)

	const { data: order, isLoading, error } = useOrderById(orderId)

	if (isLoading) {
		return (
			<>
				<Header />
				<div className='mx-auto min-h-screen max-w-4xl px-4 py-8'>
					<div className='animate-pulse space-y-4'>
						<div className='h-6 w-48 rounded bg-gray-200' />
						<div className='h-48 rounded-lg bg-gray-200' />
						<div className='h-64 rounded-lg bg-gray-200' />
					</div>
				</div>
			</>
		)
	}

	if (error || !order) {
		return (
			<>
				<Header />
				<div className='mx-auto min-h-screen max-w-4xl px-4 py-12 text-center'>
					<p className='text-xl text-red-600'>Заказ не найден</p>
					<Link
						href='/orders'
						className='mt-4 inline-block text-pur hover:underline'
					>
						← Вернуться к списку заказов
					</Link>
				</div>
			</>
		)
	}

	const paymentMethodLabels = {
		CASH: 'Наличные',
		CARD: 'Карта'
	}

	return (
		<>
			<Header />
			<div className='mx-auto max-w-6xl px-4 py-6'>
				<div className='mb-4 text-center'>
					<div className='mb-2 flex justify-center'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
							<CheckCircle className='h-8 w-8 text-green-600' />
						</div>
					</div>
					<h1 className='mb-1 text-2xl font-bold'>Заказ успешно оформлен!</h1>
					<p className='text-sm text-gray-600'>
						Номер заказа: <strong>#{order.id}</strong> •{' '}
						{new Date(order.createdAt).toLocaleDateString()}
					</p>
				</div>

				<div className='mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
					<div className='space-y-4'>
						<div className='rounded-lg bg-white p-4 shadow-sm'>
							<div className='mb-2 flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>Адрес доставки</h3>
								<OrderStatusBadge status={order.status} />
							</div>
							<div className='space-y-1 text-sm text-gray-700'>
								<p>
									<span className='font-medium'>Город:</span>{' '}
									{order.shippingCity}
								</p>
								<p>
									<span className='font-medium'>Адрес:</span>{' '}
									{order.shippingAddress}
								</p>
								{order.shippingPostalCode && (
									<p>
										<span className='font-medium'>Индекс:</span>{' '}
										{order.shippingPostalCode}
									</p>
								)}
								<p>
									<span className='font-medium'>Телефон:</span>{' '}
									{order.phoneNumber}
								</p>
								{order.notes && (
									<p>
										<span className='font-medium'>Примечания:</span>{' '}
										{order.notes}
									</p>
								)}
							</div>
						</div>

						<div className='rounded-lg bg-white p-4 shadow-sm'>
							<h3 className='mb-2 text-lg font-semibold'>Способ оплаты</h3>
							<p className='text-sm text-gray-700'>
								{paymentMethodLabels[order.paymentMethod]}
							</p>
						</div>
					</div>

					<div className='rounded-lg bg-white p-4 shadow-sm'>
						<h3 className='mb-3 text-lg font-semibold'>Товары в заказе</h3>
						<div className='mb-3 max-h-64 space-y-3 overflow-y-auto'>
							{order.orderItems.map(item => (
								<div
									key={item.id}
									className='ml-4 flex items-center gap-3 border-b pb-3 last:border-b-0'
								>
									{getMainProductImage(item.product.productImages) && (
										<img
											src={getMainProductImage(item.product.productImages)!}
											alt={item.product.name}
											className='h-16 w-16 rounded object-cover'
										/>
									)}

									<div className='flex-1'>
										<h4 className='text-sm font-medium'>{item.product.name}</h4>
										<p className='text-xs text-gray-500'>
											${item.product.price} × {item.quantity}
										</p>
									</div>
									<p className='text-sm font-semibold'>${item.amountItem}</p>
								</div>
							))}
						</div>

						<div className='border-t pt-3'>
							<div className='flex justify-between text-lg font-bold'>
								<span>Итого:</span>
								<span>${order.totalPrice}</span>
							</div>
						</div>
					</div>
				</div>

				<div className='flex justify-center gap-4'>
					<Link
						href='/orders'
						className='rounded-lg bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300'
					>
						Мои заказы
					</Link>
					<Link
						href='/'
						className='rounded-lg bg-pur px-6 py-2 text-sm font-semibold text-white transition hover:bg-purh'
					>
						На главную
					</Link>
				</div>
			</div>
		</>
	)
}
