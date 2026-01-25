'use client'

import { useOrderById } from '@entities/order'
import { OrderStatusBadge } from '@entities/order'
import { useCheckoutStore } from '@processes/checkout'
import { getMainProductImage } from '@shared/lib'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { CheckCircle, Clock, CreditCard, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function OrderDetailsPage() {
	const params = useParams()
	const orderId = Number(params.id)
	const searchParams = useSearchParams()
	const router = useRouter()
	const { shippingData } = useCheckoutStore()

	const { data: order, isLoading, error } = useOrderById(orderId)
	const success = searchParams.get('success')
	const canceled = searchParams.get('canceled')

	useEffect(() => {
		const toastShown = sessionStorage.getItem(`toast-order-${orderId}`)

		if (success === 'true' && !toastShown) {
			toast.success('Оплата прошла успешно')
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
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<div className='animate-pulse space-y-4'>
						<div className='mx-auto h-16 w-16 rounded-full bg-gray-200' />
						<div className='mx-auto h-6 w-48 rounded bg-gray-200' />
						<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
							<div className='h-40 rounded-xl bg-gray-200' />
							<div className='h-40 rounded-xl bg-gray-200' />
						</div>
					</div>
				</div>
			</>
		)
	}

	if (error || !order) {
		return (
			<>
				<Header />
				<div className='mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4'>
					<XCircle className='mb-3 h-16 w-16 text-red-400' />
					<h1 className='mb-2 text-xl font-semibold'>Заказ не найден</h1>
					<Link href='/orders' className='text-pur hover:underline'>
						← Вернуться к заказам
					</Link>
				</div>
			</>
		)
	}

	const isPayed = order.status === 'PAYED'
	const isPending = order.status === 'PENDING'

	const statusTitle = isPayed
		? 'Заказ оплачен'
		: canceled === 'true'
			? 'Оплата отменена'
			: isPending
				? 'Ожидает оплаты'
				: 'Заказ оформлен'

	return (
		<>
			<Header />
			<main className='mx-auto max-w-6xl px-4 py-8'>
				<div className='mb-8 text-center'>
					<h1 className='mb-1 text-2xl font-bold'>Заказ #{order.id}</h1>
					<p className='text-gray-500'>{statusTitle}</p>
				</div>

				{isPending && (
					<div className='mb-8 text-center'>
						<button
							onClick={async () => {
								try {
									const response = await fetch(
										`${process.env.NEXT_PUBLIC_SERVER_URL}/api/stripe/checkout/${order.id}`,
										{ method: 'POST', credentials: 'include' }
									)
									const { url } = await response.json()
									window.location.href = url
								} catch {
									toast.error('Не удалось создать сессию оплаты')
								}
							}}
							className='rounded-full bg-pur px-8 py-3 font-medium text-white transition hover:bg-purh'
						>
							Оплатить ${order.totalPrice}
						</button>
					</div>
				)}

				<div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
					<div className='rounded-2xl border border-gray-100 bg-white p-6'>
						<div className='mb-4 flex items-center justify-between'>
							<h2 className='text-lg font-semibold'>Данные получателя</h2>
							<OrderStatusBadge status={order.status} />
						</div>
						<div className='space-y-3 text-sm'>
							<div className='flex justify-between'>
								<span className='text-gray-500'>Получатель</span>
								<span className='font-medium'>
									{shippingData?.firstName} {shippingData?.lastName}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-500'>Телефон</span>
								<span className='font-medium'>{order.phoneNumber}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-500'>Email</span>
								<span className='font-medium'>{shippingData?.email}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-500'>Город</span>
								<span className='font-medium'>{order.shippingCity}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-500'>Адрес</span>
								<span className='font-medium'>
									{order.shippingAddress}, {order.shippingPostalCode}
								</span>
							</div>

							{order.notes && (
								<div className='mt-3 rounded-lg bg-gray-50 p-3 text-gray-600'>
									{order.notes}
								</div>
							)}
						</div>
					</div>

					<div className='rounded-2xl border border-gray-100 bg-white p-6'>
						<h2 className='mb-4 text-lg font-semibold'>
							Товары ({order.orderItems.length})
						</h2>
						<div className='space-y-4'>
							{order.orderItems.map(item => (
								<div key={item.id} className='flex items-center gap-4'>
									<div className='relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50'>
										{getMainProductImage(item.product.productImages) ? (
											<Image
												src={getMainProductImage(item.product.productImages)!}
												alt={item.product.name}
												fill
												className='object-cover'
											/>
										) : (
											<div className='flex h-full w-full items-center justify-center text-xs text-gray-400'>
												Нет фото
											</div>
										)}
									</div>
									<div className='min-w-0 flex-1'>
										<p className='truncate font-medium'>{item.product.name}</p>
										<p className='text-sm text-gray-500'>
											{item.quantity} × ${item.product.price}
										</p>
									</div>
									<p className='font-semibold'>${item.amountItem}</p>
								</div>
							))}
						</div>
						<div className='mt-4 flex items-center justify-between border-t pt-4'>
							<span className='text-gray-600'>Итого</span>
							<span className='text-xl font-bold'>${order.totalPrice}</span>
						</div>
					</div>
				</div>

				<div className='flex justify-center gap-4 mb-14'>
					<Link
						href='/orders'
						className='rounded-full border border-gray-200 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50'
					>
						Мои заказы
					</Link>
					<Link
						href='/'
						className='rounded-full bg-pur px-6 py-2.5 font-medium text-white transition hover:bg-purh'
					>
						На главную
					</Link>
				</div>
			</main>
			<Footer />
		</>
	)
}
