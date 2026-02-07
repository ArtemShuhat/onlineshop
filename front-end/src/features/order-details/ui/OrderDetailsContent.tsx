'use client';

import { Order, OrderStatus } from '@entities/order';
import { OrderStatusBadge } from '@entities/order';
import { getMainProductImage } from '@shared/lib';
import { CheckCircle, Clock, CreditCard, Home, Mail, MapPin, MessageSquare, Package, Phone, Receipt, Truck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';





interface OrderDetailsContentProps {
	order: Order
}

export function OrderDetailsContent({ order }: OrderDetailsContentProps) {
	const isPayed = order.status === OrderStatus.PAYED
	const isPending = order.status === OrderStatus.PENDING
	const isShipped = order.status === OrderStatus.SHIPPED
	const isDelivered = order.status === OrderStatus.DELIVERED

	const statusConfig = {
		[OrderStatus.PENDING]: {
			icon: Clock,
			color: 'from-yellow-500 to-orange-500',
			title: 'Ожидает оплаты'
		},
		[OrderStatus.PAYED]: {
			icon: CheckCircle,
			color: 'from-green-800 to-emerald-500',
			title: 'Заказ оплачен'
		},
		[OrderStatus.SHIPPED]: {
			icon: Truck,
			color: 'from-blue-500 to-cyan-500',
			title: 'В пути'
		},
		[OrderStatus.DELIVERED]: {
			icon: Package,
			color: 'from-indigo-500 to-cyan-700',
			title: 'Доставлено'
		}
	}

	const currentStatus = statusConfig[order.status]
	const StatusIcon = currentStatus.icon

	const handlePayment = async () => {
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
	}

	return (
		<main className='min-h-screen px-4 py-8'>
			<div className='mx-auto max-w-5xl'>
				<div className='mb-8 overflow-hidden rounded-2xl bg-white shadow-lg'>
					<div
						className={`bg-gradient-to-r ${currentStatus.color} px-6 py-8 text-white`}
					>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-4'>
								<div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm'>
									<StatusIcon className='h-8 w-8' />
								</div>
								<div>
									<h1 className='text-3xl font-bold'>Заказ #{order.id}</h1>
									<p className='mt-1 text-white/90'>{currentStatus.title}</p>
								</div>
							</div>
							<OrderStatusBadge status={order.status} />
						</div>
					</div>
					<div className='bg-white px-6 py-6'>
						<div className='flex items-center justify-between'>
							<div className='flex flex-1 flex-col items-center'>
								<div
									className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
										isPending || isPayed || isShipped || isDelivered
											? 'bg-green-600 text-white'
											: 'bg-gray-200 text-gray-400'
									}`}
								>
									<Clock className='h-5 w-5' />
								</div>
								<p className='text-xs font-medium text-gray-600'>Создан</p>
							</div>

							<div
								className={`-mx-2 h-1 flex-1 ${isPayed || isShipped || isDelivered ? 'bg-green-600' : 'bg-gray-200'}`}
							/>
							<div className='flex flex-1 flex-col items-center'>
								<div
									className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
										isPayed || isShipped || isDelivered
											? 'bg-green-600 text-white'
											: 'bg-gray-200 text-gray-400'
									}`}
								>
									<CreditCard className='h-5 w-5' />
								</div>
								<p className='text-xs font-medium text-gray-600'>Оплачен</p>
							</div>

							<div
								className={`-mx-2 h-1 flex-1 ${isShipped || isDelivered ? 'bg-green-600' : 'bg-gray-200'}`}
							/>
							<div className='flex flex-1 flex-col items-center'>
								<div
									className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
										isShipped || isDelivered
											? 'bg-green-600 text-white'
											: 'bg-gray-200 text-gray-400'
									}`}
								>
									<Truck className='h-5 w-5' />
								</div>
								<p className='text-xs font-medium text-gray-600'>В пути</p>
							</div>

							<div
								className={`-mx-2 h-1 flex-1 ${isDelivered ? 'bg-green-500' : 'bg-gray-200'}`}
							/>
							<div className='flex flex-1 flex-col items-center'>
								<div
									className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
										isDelivered
											? 'bg-green-600 text-white'
											: 'bg-gray-200 text-gray-400'
									}`}
								>
									<Package className='h-5 w-5' />
								</div>
								<p className='text-xs font-medium text-gray-600'>Доставлен</p>
							</div>
						</div>
					</div>
				</div>
				{isPending && (
					<div className='mb-6 overflow-hidden rounded-2xl border-2 border-pur bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg'>
						<div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
							<div>
								<h3 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
									<CreditCard className='h-5 w-5 text-pur' />
									Готовы оплатить заказ?
								</h3>
								<p className='mt-1 text-sm text-gray-600'>
									Нажмите кнопку для перехода к безопасной оплате
								</p>
							</div>
							<button
								onClick={handlePayment}
								className='flex items-center gap-2 rounded-full bg-pur px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purh hover:shadow-xl'
							>
								<CreditCard className='h-5 w-5' />
								Оплатить ${order.totalPrice}
							</button>
						</div>
					</div>
				)}
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
					<div className='space-y-6 lg:col-span-2'>
						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
									<Package className='h-5 w-5 text-blue-600' />
									Товары в заказе ({order.orderItems.length})
								</h2>
							</div>
							<div className='divide-y divide-gray-100 p-4'>
								{order.orderItems.map(item => (
									<div key={item.id} className='flex items-center gap-4 py-4'>
										<div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm'>
											{getMainProductImage(item.product.productImages) ? (
												<Image
													src={getMainProductImage(item.product.productImages)!}
													alt={item.product.name}
													fill
													className='object-cover'
												/>
											) : (
												<div className='flex h-full w-full items-center justify-center'>
													<Package className='h-8 w-8 text-gray-300' />
												</div>
											)}
										</div>
										<div className='min-w-0 flex-1'>
											<Link
												href={`/products/${item.product.id}`}
												className='line-clamp-2 font-bold text-gray-900 hover:text-pur'
											>
												{item.product.name}
											</Link>
											<div className='mt-1 flex items-center gap-2'>
												<span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'>
													${item.product.price}
												</span>
												<span className='text-xs text-gray-400'>×</span>
												<span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
													{item.quantity} шт
												</span>
											</div>
										</div>
										<div className='text-right'>
											<p className='text-lg font-bold text-gray-900'>
												${item.amountItem}
											</p>
										</div>
									</div>
								))}
							</div>
							<div className='border-t px-6 py-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<Receipt className='h-5 w-5 text-emerald-600' />
										<span className='text-sm font-semibold text-gray-700'>
											Общая сумма
										</span>
									</div>
									<span className='text-2xl font-bold'>
										${order.totalPrice}
									</span>
								</div>
							</div>
						</div>
						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
									<Truck className='h-5 w-5 text-purple-600' />
									Информация о доставке
								</h2>
							</div>
							<div className='space-y-4 p-6'>
								<div className='flex items-start gap-3'>
									<div className='rounded-lg bg-gray-50 p-2 shadow-sm'>
										<User className='h-5 w-5 text-purple-600' />
									</div>
									<div>
										<p className='text-xs font-medium text-gray-500'>
											Получатель
										</p>
										<p className='mt-1 font-bold text-gray-900'>
											{order?.firstName} {order?.lastName}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-3'>
									<div className='rounded-lg bg-gray-50 p-2 shadow-sm'>
										<Phone className='h-5 w-5 text-blue-600' />
									</div>
									<div>
										<p className='text-xs font-medium text-gray-500'>Телефон</p>
										<p className='mt-1 font-bold text-gray-900'>
											{order.phoneNumber}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-3'>
									<div className='rounded-lg bg-gray-50 p-2 shadow-sm'>
										<Mail className='h-5 w-5 text-green-600' />
									</div>
									<div>
										<p className='text-xs font-medium text-gray-500'>Email</p>
										<p className='mt-1 font-bold text-gray-900'>
											{order?.email}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-3'>
									<div className='rounded-lg bg-gray-50 p-2 shadow-sm'>
										<MapPin className='h-5 w-5 text-orange-600' />
									</div>
									<div className='flex-1'>
										<p className='text-xs font-medium text-gray-500'>
											Адрес доставки
										</p>
										<p className='mt-1 font-bold text-gray-900'>
											{order.shippingCity}
										</p>
										<p className='mt-0.5 text-sm text-gray-600'>
											{order.shippingAddress}
										</p>
										<p className='text-sm text-gray-600'>
											{order.shippingPostalCode}
										</p>
									</div>
								</div>

								{order.notes && (
									<div className='rounded-xl border border-amber-200 bg-amber-50 p-4'>
										<div className='flex gap-2'>
											<MessageSquare className='h-5 w-5 flex-shrink-0 text-amber-600' />
											<div>
												<p className='text-xs font-medium text-amber-900'>
													Примечание к заказу
												</p>
												<p className='mt-1 text-sm text-amber-800'>
													{order.notes}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className='space-y-6'>
						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3'>
								<h3 className='text-sm font-bold text-gray-900'>О заказе</h3>
							</div>
							<div className='space-y-3 p-4 text-sm'>
								<div>
									<p className='text-xs font-medium text-gray-500'>
										Дата создания
									</p>
									<p className='mt-1 font-bold text-gray-900'>
										{new Date(order.createdAt).toLocaleDateString('ru-RU', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
									<p className='text-xs text-gray-500'>
										{new Date(order.createdAt).toLocaleTimeString('ru-RU', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>

								<div className='border-t pt-3'>
									<p className='text-xs font-medium text-gray-500'>
										Последнее обновление
									</p>
									<p className='mt-1 font-bold text-gray-900'>
										{new Date(order.updatedAt).toLocaleDateString('ru-RU', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
									<p className='text-xs text-gray-500'>
										{new Date(order.updatedAt).toLocaleTimeString('ru-RU', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>

								<div className='border-t pt-3'>
									<p className='text-xs font-medium text-gray-500'>
										Товаров в заказе
									</p>
									<p className='mt-1 text-2xl font-bold text-pur'>
										{order.orderItems.length}
									</p>
								</div>
							</div>
						</div>
						<div className='overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 shadow-sm'>
							<div className='p-4'>
								<h3 className='mb-2 flex items-center gap-2 text-sm font-bold text-blue-900'>
									<Mail className='h-4 w-4' />
									Нужна помощь?
								</h3>
								<p className='mb-3 text-xs text-blue-700'>
									Если у вас есть вопросы по заказу, свяжитесь с нами:
								</p>
								<a
									href='https://t.me/ltdstore'
									target='_blank'
									className='block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700'
								>
									Написать в поддержку
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-8 flex justify-center gap-4'>
					<Link
						href='/orders'
						className='rounded-full border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50'
					>
						← Мои заказы
					</Link>
					<Link
						href='/'
						className='flex items-center gap-2 rounded-full bg-pur px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purh hover:shadow-xl'
					>
						<Home className='h-5 w-5' />
						На главную
					</Link>
				</div>
			</div>
		</main>
	)
}