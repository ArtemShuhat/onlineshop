'use client'

import { Order, OrderStatus } from '@entities/order'
import { SortDirection } from '@shared/hooks'
import { ArrowUpDown, Eye } from 'lucide-react'
import { useState } from 'react'

import { ConfirmStatusChangeDialog } from './ConfirmStatusChangeDialog'

export type OrderSortColumn = 'id' | 'user' | 'totalPrice' | 'createdAt'

interface OrdersTableProps {
	orders: Order[]
	onStatusChange: (orderId: number, status: OrderStatus) => void
	onViewDetails: (order: Order) => void
	sortColumn: OrderSortColumn
	sortDirection: SortDirection
	onSort: (column: OrderSortColumn) => void
}

const statusColors = {
	[OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	[OrderStatus.PAYED]: 'bg-green-100 text-green-800 border-green-200',
	[OrderStatus.SHIPPED]: 'bg-blue-100 text-blue-800 border-blue-200',
	[OrderStatus.DELIVERED]: 'bg-purple-100 text-purple-800 border-purple-200'
}

const statusLabels = {
	[OrderStatus.PENDING]: 'Ожидает оплаты',
	[OrderStatus.PAYED]: 'Оплачено',
	[OrderStatus.SHIPPED]: 'Отправлено',
	[OrderStatus.DELIVERED]: 'Доставлено'
}

export function OrdersTable({
	orders,
	onStatusChange,
	onViewDetails,
	sortColumn,
	sortDirection,
	onSort
}: OrdersTableProps) {
	const [pendingChange, setPendingChange] = useState<{
		orderId: number
		currentStatus: OrderStatus
		newStatus: OrderStatus
	} | null>(null)

	const SortHeader = ({
		column,
		children,
		className = ''
	}: {
		column: OrderSortColumn
		children: React.ReactNode
		className?: string
	}) => {
		const isActive = sortColumn === column
		return (
			<th
				className={`cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50 ${className}`}
				onClick={() => onSort(column)}
			>
				<div className='flex items-center gap-2'>
					{children}
					<ArrowUpDown
						className={`h-3.5 w-3.5 transition-all ${
							isActive
								? sortDirection === 'desc'
									? 'rotate-180 text-pur'
									: 'text-pur'
								: 'text-gray-400'
						}`}
					/>
				</div>
			</th>
		)
	}

	const handleStatusSelectChange = (
		orderId: number,
		currentStatus: OrderStatus,
		newStatus: OrderStatus
	) => {
		if (currentStatus === newStatus) return
		setPendingChange({ orderId, currentStatus, newStatus })
	}

	const handleConfirm = () => {
		if (pendingChange) {
			onStatusChange(pendingChange.orderId, pendingChange.newStatus)
			setPendingChange(null)
		}
	}

	if (orders.length === 0) {
		return (
			<div className='p-12 text-center'>
				<p className='text-gray-500'>Заказов не найдено</p>
			</div>
		)
	}

	return (
		<>
			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead className='border-b bg-gray-50'>
						<tr>
							<SortHeader column='id'># Заказ</SortHeader>
							<SortHeader column='user'>Клиент</SortHeader>
							<SortHeader column='totalPrice'>Сумма</SortHeader>
							<th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>
								Статус
							</th>
							<SortHeader column='createdAt'>Дата</SortHeader>
							<th className='px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700'>
								Действия
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{orders.map(order => (
							<tr key={order.id} className='transition-colors hover:bg-gray-50'>
								<td className='whitespace-nowrap px-4 py-4'>
									<span className='font-mono text-sm font-semibold text-gray-900'>
										#{order.id}
									</span>
								</td>
								<td className='px-4 py-4'>
									<div>
										<div className='text-sm font-semibold text-gray-900'>
											{order.user.displayName}
										</div>
										<div className='text-xs font-semibold text-gray-600'>
											{order.user.email}
										</div>
									</div>
								</td>
								<td className='whitespace-nowrap px-4 py-4'>
									<span className='text-sm font-semibold text-gray-900'>
										${order.totalPrice}
									</span>
								</td>
								<td className='whitespace-nowrap px-4 py-4'>
									<select
										value={order.status}
										onChange={e =>
											handleStatusSelectChange(
												order.id,
												order.status,
												e.target.value as OrderStatus
											)
										}
										disabled={order.status === OrderStatus.DELIVERED}
										className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pur disabled:cursor-not-allowed disabled:opacity-60 ${
											statusColors[order.status]
										}`}
									>
										<option value={OrderStatus.PENDING}>
											{statusLabels[OrderStatus.PENDING]}
										</option>
										<option value={OrderStatus.PAYED}>
											{statusLabels[OrderStatus.PAYED]}
										</option>
										<option value={OrderStatus.SHIPPED}>
											{statusLabels[OrderStatus.SHIPPED]}
										</option>
										<option value={OrderStatus.DELIVERED}>
											{statusLabels[OrderStatus.DELIVERED]}
										</option>
									</select>
								</td>
								<td className='whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900'>
									<div>
										{new Date(order.createdAt).toLocaleDateString('ru-RU')}
									</div>
									<div className='text-xs font-semibold text-gray-500'>
										{new Date(order.createdAt).toLocaleTimeString('ru-RU', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</div>
								</td>
								<td className='whitespace-nowrap px-4 py-4 text-right'>
									<button
										onClick={() => onViewDetails(order)}
										className='inline-flex items-center gap-1.5 rounded-lg bg-pur px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purh'
									>
										<Eye className='h-3.5 w-3.5' />
										Детали
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{pendingChange && (
				<ConfirmStatusChangeDialog
					isOpen={!!pendingChange}
					onClose={() => setPendingChange(null)}
					onConfirm={handleConfirm}
					currentStatus={pendingChange.currentStatus}
					newStatus={pendingChange.newStatus}
				/>
			)}
		</>
	)
}
