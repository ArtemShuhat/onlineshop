'use client'

import { Order } from '@entities/order'
import { OrderStatusBadge } from '@entities/order'
import { getMainProductImage } from '@shared/lib'

interface OrderDetailsDialogProps {
	order: Order | null
	onClose: () => void
}

export function OrderDetailsDialog({
	order,
	onClose
}: OrderDetailsDialogProps) {
	if (!order) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8'>
				<div className='mb-6 flex items-center justify-between'>
					<h2 className='text-2xl font-bold'>Заказ #{order.id}</h2>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700'
					>
						<svg
							className='h-6 w-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				<div className='space-y-6'>
					<div>
						<h3 className='mb-2 text-lg font-semibold'>Статус</h3>
						<OrderStatusBadge status={order.status} />
					</div>

					<div>
						<h3 className='mb-2 text-lg font-semibold'>
							Информация о пользователе
						</h3>
						<div className='rounded bg-gray-50 p-4'>
							<p>
								<strong>Имя:</strong> {order.user.displayName}
							</p>
							<p>
								<strong>Email:</strong> {order.user.email}
							</p>
						</div>
					</div>

					<div>
						<h3 className='mb-2 text-lg font-semibold'>Товари</h3>
						<div className='space-y-3'>
							{order.orderItems.map(item => (
								<div
									key={item.id}
									className='flex items-center gap-4 rounded border p-4'
								>
									{getMainProductImage(item.product.productImages) && (
										<img
											src={getMainProductImage(item.product.productImages)!}
											alt={item.product.name}
											className='h-16 w-16 rounded object-cover'
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

					<div className='rounded bg-blue-50 p-4'>
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
			</div>
		</div>
	)
}
