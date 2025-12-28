import { getMainProductImage } from '@shared/lib/getProductImages'

import { Order } from '../model/order.types'

import { OrderStatusBadge } from './OrderStatus'

interface OrderCardProps {
	order: Order
	onClick?: () => void
}

export function OrderCard({ order, onClick }: OrderCardProps) {
	return (
		<div
			className='cursor-pointer rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md'
			onClick={onClick}
		>
			<div className='mb-4 flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold'>Заказ #{order.id}</h3>
					<p className='text-sm text-gray-500'>
						{new Date(order.createdAt).toLocaleDateString()}
					</p>
				</div>
				<OrderStatusBadge status={order.status} />
			</div>

			<div className='space-y-2'>
				{order.orderItems.slice(0, 3).map(item => (
					<div key={item.id} className='flex items-center gap-3'>
						{getMainProductImage(item.product.productImages) && (
							<img
								src={getMainProductImage(item.product.productImages)!}
								alt={item.product.name}
								className='h-12 w-12 rounded object-cover'
							/>
						)}

						<div className='flex-1'>
							<p className='text-sm font-medium'>{item.product.name}</p>
							<p className='text-xs text-gray-500'>
								Количество: {item.quantity}
							</p>
						</div>
						<p className='text-sm font-semibold'>${item.amountItem}</p>
					</div>
				))}
				{order.orderItems.length > 3 && (
					<p className='text-sm text-gray-500'>
						+еще {order.orderItems.length - 3} товаров
					</p>
				)}
			</div>

			<div className='mt-4 border-t pt-4'>
				<div className='flex justify-between'>
					<span className='font-semibold'>Всего:</span>
					<span className='text-lg font-bold'>${order.totalPrice}</span>
				</div>
			</div>
		</div>
	)
}
