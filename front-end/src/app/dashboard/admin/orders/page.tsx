'use client'

import { Order, OrderStatus } from '@entities/order'
import {
	OrderDetailsDialog,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import { useState } from 'react'

export default function AdminOrdersPage() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [statusFilter, setStatusFilter] = useState<string>('')
	const [searchQuery, setSearchQuery] = useState('')

	const { data: orders, isLoading } = useOrders({
		status: statusFilter || undefined,
		search: searchQuery || undefined
	})

	const { mutate: updateStatus } = useUpdateOrderStatus()

	const handleStatusChange = (orderId: number, status: OrderStatus) => {
		updateStatus({ orderId, status })
	}

	return (
		<div className='space-y-6'>
			<h1 className='mb-8 mt-4 text-2xl font-bold'>Управление заказами</h1>

			<div className='mb-6 flex gap-4'>
				<input
					type='text'
					placeholder='Поиск по пользователю...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='flex-1 rounded-lg border px-4 py-2'
				/>

				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className='px-4 py-2 focus:outline-none'
				>
					<option value=''>Все статусы</option>
					<option value={OrderStatus.PENDING}>Ожидает оплаты</option>
					<option value={OrderStatus.PAYED}>Оплачено</option>
					<option value={OrderStatus.SHIPPED}>Отправлено</option>
					<option value={OrderStatus.DELIVERED}>Доставлено</option>
				</select>
			</div>

			<div className='rounded-lg bg-white shadow'>
				{isLoading ? (
					<div className='p-20 text-center'>Загрузка...</div>
				) : orders && orders.length > 0 ? (
					<OrdersTable
						orders={orders}
						onStatusChange={handleStatusChange}
						onViewDetails={setSelectedOrder}
					/>
				) : (
					<div className='p-20 text-center text-gray-500'>Заказ не найден</div>
				)}
			</div>

			<OrderDetailsDialog
				order={selectedOrder}
				onClose={() => setSelectedOrder(null)}
			/>
		</div>
	)
}
