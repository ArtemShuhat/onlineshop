'use client'

import { type Order, OrderStatus } from '@entities/order'
import {
	OrderDetailsDialog,
	OrderSortColumn,
	OrdersTable,
	useOrders,
	useUpdateOrderStatus
} from '@features/admin-orders'
import { useSortable } from '@shared/hooks'
import { Input } from '@shared/ui'
import {
	DollarSign,
	Package,
	Search,
	ShoppingCart,
	TrendingUp
} from 'lucide-react'
import { useMemo, useState } from 'react'

export function AdminOrdersSection() {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [statusFilter, setStatusFilter] = useState<string>('')
	const [searchQuery, setSearchQuery] = useState('')

	const { data: orders = [], isLoading: loadingOrders } = useOrders()
	const { mutate: updateStatus } = useUpdateOrderStatus()

	const { sortColumn, sortDirection, handleSort, getSortedData } =
		useSortable<OrderSortColumn>('id', 'desc')

	const filteredOrders = useMemo(() => {
		return orders.filter(order => {
			const matchesStatus = !statusFilter || order.status === statusFilter
			const matchesSearch =
				!searchQuery ||
				order.user.displayName
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.id.toString().includes(searchQuery)

			return matchesStatus && matchesSearch
		})
	}, [orders, statusFilter, searchQuery])

	const sortedOrders = getSortedData(filteredOrders, (a, b, column) => {
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

	const stats = useMemo(() => {
		const total = orders.length
		const totalRevenue = orders.reduce(
			(sum, order) => sum + order.totalPrice,
			0
		)
		const pending = orders.filter(o => o.status === OrderStatus.PENDING).length
		const delivered = orders.filter(
			o => o.status === OrderStatus.DELIVERED
		).length

		return { total, totalRevenue, pending, delivered }
	}, [orders])

	if (loadingOrders) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pur' />
					<p className='mt-4 text-sm text-gray-600'>Загрузка заказов...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold text-gray-900'>
					Управление заказами
				</h2>
				<p className='mt-1 text-sm text-gray-600'>
					Просмотр и обработка заказов клиентов
				</p>
			</div>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<div className='rounded-lg border bg-white p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-blue-100 p-3'>
							<ShoppingCart className='h-5 w-5 text-blue-600' />
						</div>
						<div>
							<p className='text-xs text-gray-600'>Всего заказов</p>
							<p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
						</div>
					</div>
				</div>

				<div className='rounded-lg border bg-white p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-green-100 p-3'>
							<DollarSign className='h-5 w-5 text-green-600' />
						</div>
						<div>
							<p className='text-xs text-gray-600'>Общая выручка</p>
							<p className='text-2xl font-bold text-gray-900'>
								${stats.totalRevenue.toFixed(2)}
							</p>
						</div>
					</div>
				</div>

				<div className='rounded-lg border bg-white p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-yellow-100 p-3'>
							<Package className='h-5 w-5 text-yellow-600' />
						</div>
						<div>
							<p className='text-xs text-gray-600'>Ожидают оплаты</p>
							<p className='text-2xl font-bold text-gray-900'>
								{stats.pending}
							</p>
						</div>
					</div>
				</div>

				<div className='rounded-lg border bg-white p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-purple-100 p-3'>
							<TrendingUp className='h-5 w-5 text-purple-600' />
						</div>
						<div>
							<p className='text-xs text-gray-600'>Доставлено</p>
							<p className='text-2xl font-bold text-gray-900'>
								{stats.delivered}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm sm:flex-row'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
					<Input
						type='text'
						placeholder='Поиск по имени, email или ID заказа...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='pl-9'
					/>
				</div>

				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-pur focus:outline-none focus:ring-1 focus:ring-pur'
				>
					<option value=''>Все статусы</option>
					<option value={OrderStatus.PENDING}>Ожидает оплаты</option>
					<option value={OrderStatus.PAYED}>Оплачено</option>
					<option value={OrderStatus.SHIPPED}>Отправлено</option>
					<option value={OrderStatus.DELIVERED}>Доставлено</option>
				</select>

				{(searchQuery || statusFilter) && (
					<button
						onClick={() => {
							setSearchQuery('')
							setStatusFilter('')
						}}
						className='text-sm text-gray-600 hover:text-gray-900'
					>
						Сбросить
					</button>
				)}
			</div>

			{filteredOrders.length !== orders.length && (
				<div className='text-sm text-gray-600'>
					Найдено заказов: {filteredOrders.length} из {orders.length}
				</div>
			)}

			<div className='rounded-lg border bg-white shadow-sm'>
				<OrdersTable
					orders={sortedOrders}
					onStatusChange={(orderId, status) =>
						updateStatus({ orderId, status })
					}
					onViewDetails={order => setSelectedOrder(order)}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
					onSort={handleSort}
				/>
			</div>

			<OrderDetailsDialog
				order={selectedOrder}
				onClose={() => setSelectedOrder(null)}
			/>
		</div>
	)
}
