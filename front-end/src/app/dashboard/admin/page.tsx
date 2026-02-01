'use client'

import { type Order } from '@entities/order'
import { AdminBannersSection } from '@features/admin-banners'
import {
	OrderDetailsDialog,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import {
	AdminCategoriesSection,
	AdminProductsSection
} from '@features/admin-products'
import { AdminSidebar } from '@widgets/admin-sidebar'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function AdminDashboardPage() {
	// Orders state
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const { data: orders = [], isLoading: loadingOrders } = useOrders()
	const { mutate: updateStatus } = useUpdateOrderStatus()

	// Active tab
	const searchParams = useSearchParams()
	const activeTab = searchParams.get('tab') || 'products'

	if (loadingOrders && activeTab === 'orders') {
		return (
			<>
				<AdminSidebar />
				<div className='ml-64 flex h-screen flex-1 items-center justify-center'>
					<div className='text-center'>
						<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
						<p className='mt-4 text-gray-600'>Загрузка...</p>
					</div>
				</div>
			</>
		)
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'products':
				return <AdminProductsSection />
			case 'categories':
				return <AdminCategoriesSection />
			case 'banners':
				return <AdminBannersSection />
			case 'orders':
				return (
					<>
						<div className='mb-6 mt-4 flex items-center justify-between'>
							<h1 className='text-2xl font-bold'>Управление заказами</h1>
						</div>
						<OrdersTable
							orders={orders}
							onStatusChange={(orderId, status) =>
								updateStatus({ orderId, status })
							}
							onViewDetails={order => setSelectedOrder(order)}
						/>
						<OrderDetailsDialog
							order={selectedOrder}
							onClose={() => setSelectedOrder(null)}
						/>
					</>
				)
			default:
				return <AdminProductsSection />
		}
	}

	return (
		<>
			<AdminSidebar />
			<div className='container mx-auto p-6'>{renderContent()}</div>
		</>
	)
}
