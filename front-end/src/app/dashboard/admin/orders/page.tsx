'use client'

import { Order, OrderStatus } from '@entities/order'
import {
	OrderDetailsDialog,
	OrderSortColumn,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import { useSortable } from '@shared/hooks'
import { useState } from 'react'

export default function AdminOrdersPage() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [statusFilter, setStatusFilter] = useState<string>('')
	const [searchQuery, setSearchQuery] = useState('')

	const { sortColumn, sortDirection, handleSort, getSortedData } =
		useSortable<OrderSortColumn>('id', 'desc')

	const { data: orders, isLoading } = useOrders({
		status: statusFilter || undefined,
		search: searchQuery || undefined
	})

	const { mutate: updateStatus } = useUpdateOrderStatus()

	const handleStatusChange = (orderId: number, status: OrderStatus) => {
		updateStatus({ orderId, status })
	}

	const sortedOrders = getSortedData(orders || [], (a, b, column) => {
		switch (column) {
			case 'id':
				return a.id - b.id
			case 'user':
				return a.user.displayName.localeCompare(b.user.displayName, 'ru')
			case 'totalPrice':
				return a.totalPrice - b.totalPrice
			case 'createdAt':
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			default:
				return 0
		}
	})

	return (
		<div className='space-y-6'>
			<h1 className='mb-8 mt-4 text-2xl font-bold'>Управление заказами</h1>

			<div className='mb-6 flex gap-4'>
				<input
					type='text'
					placeholder='Поиск по пользователю...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='flex-1 rounded-lg border px-4 py-2 focus:outline-none'
				/>

				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className='rounded-lg px-4 py-2 focus:outline-none'
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
				) : sortedOrders && sortedOrders.length > 0 ? (
					<OrdersTable
						orders={sortedOrders}
						onStatusChange={handleStatusChange}
						onViewDetails={setSelectedOrder}
						sortColumn={sortColumn}
						sortDirection={sortDirection}
						onSort={handleSort}
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
