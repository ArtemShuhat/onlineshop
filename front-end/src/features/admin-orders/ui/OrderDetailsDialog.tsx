'use client'

import { Order } from '@entities/order'
import { OrderStatusBadge } from '@entities/order'
import { getMainProductImage } from '@shared/lib'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui'
import Image from 'next/image'

interface OrderDetailsDialogProps {
	onClose: () => void
	order: Order | null
}

export function OrderDetailsDialog({
	order,
	onClose
}: OrderDetailsDialogProps) {
	const isOpen = order !== null

	if (!order) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto outline-none focus:outline-none'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold'>
						Заказ #{order.id}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<h3 className='mb-2 text-lg font-semibold'>Статус</h3>
						<OrderStatusBadge status={order.status} />
					</div>

					<div className='flex justify-between gap-5'>
						<div className='w-[50%]'>
							<h3 className='mb-2 text-lg font-semibold'>
								Информация о пользователе
							</h3>
							<div className='rounded bg-gray-100 p-4'>
								<p>
									<strong>Имя:</strong> {order.firstName}
								</p>
								<p>
									<strong>Email:</strong> {order.user.email}
								</p>
							</div>
						</div>
						<div className='w-[50%]'>
							<h3 className='mb-2 text-lg font-semibold'>
								Информация о доставке
							</h3>
							<div className='rounded bg-gray-100 p-4'>
								<p>
									<strong>Город:</strong> {order.shippingCity}
								</p>
								<p>
									<strong>Адрес:</strong>{' '}
									{order.shippingAddress + ', ' + order.shippingPostalCode}
								</p>
							</div>
						</div>
					</div>

					{order.notes && (
						<div className=''>
							<h3 className='mb-2 text-lg font-semibold'>Заметки к заказу</h3>
							<div className='rounded bg-gray-100 p-4'>
								<p>{order.notes}</p>
							</div>
						</div>
					)}

					<div>
						<h3 className='mb-2 text-lg font-semibold'>Товары</h3>
						<div className='space-y-3'>
							{order.orderItems.map(item => (
								<div
									key={item.id}
									className='flex items-center gap-4 rounded border p-4'
								>
									{getMainProductImage(item.product.productImages) && (
										<Image
											src={getMainProductImage(item.product.productImages)!}
											alt={item.product.name}
											width={64}
											height={64}
											className='rounded object-cover'
										/>
									)}

									<div className='flex-1'>
										<p className='font-semibold'>{item.product.name}</p>
										<p className='text-sm text-gray-600'>
											${item.product.price} × {item.quantity}
										</p>
									</div>
									<p className='font-bold'>${item.amountItem}</p>
								</div>
							))}
						</div>
					</div>

					<div className='rounded bg-gray-100 p-4'>
						<div className='flex justify-between text-xl font-bold'>
							<span>Всего:</span>
							<span>${order.totalPrice}</span>
						</div>
					</div>

					<div>
						<p className='text-sm text-gray-500'>
							Создано: {new Date(order.createdAt).toLocaleString()}
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
