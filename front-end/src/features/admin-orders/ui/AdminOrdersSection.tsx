'use client'

import { type Order } from '@entities/order'
import {
	OrderDetailsDialog,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import { useState } from 'react'

export function AdminOrdersSection() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const { data: orders = [], isLoading: loadingOrders } = useOrders()
	const { mutate: updateStatus } = useUpdateOrderStatus()

	if (loadingOrders) {
		return (
			<div className='flex items-center justify-center py-12'>
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
				orders={orders}
				onStatusChange={(orderId, status) => updateStatus({ orderId, status })}
				onViewDetails={order => setSelectedOrder(order)}
			/>

			<OrderDetailsDialog
				order={selectedOrder}
				onClose={() => setSelectedOrder(null)}
			/>
		</div>
	)
}
