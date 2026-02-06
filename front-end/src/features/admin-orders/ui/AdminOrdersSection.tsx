'use client'

import { type Order } from '@entities/order'
import {
	OrderDetailsDialog,
	OrderSortColumn,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import { useSortable } from '@shared/hooks'
import { useState } from 'react'

export function AdminOrdersSection() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const { data: orders = [], isLoading: loadingOrders } = useOrders()
	const { mutate: updateStatus } = useUpdateOrderStatus()

	const { sortColumn, sortDirection, handleSort, getSortedData } =
		useSortable<OrderSortColumn>('id', 'desc')

	const sortedOrders = getSortedData(orders, (a, b, column) => {
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

	if (loadingOrders) {
		return (
			<div className='flex min-h-screen items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
					<p className='mt-4 text-gray-600'>Загрузка заказов...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='mt-4 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Управление заказами</h2>
			</div>

			<OrdersTable
				orders={sortedOrders}
				onStatusChange={(orderId, status) => updateStatus({ orderId, status })}
				onViewDetails={order => setSelectedOrder(order)}
				sortColumn={sortColumn}
				sortDirection={sortDirection}
				onSort={handleSort}
			/>

			<OrderDetailsDialog
				order={selectedOrder}
				onClose={() => setSelectedOrder(null)}
			/>
		</div>
	)
}
