'use client'

import { Order } from '@entities/order'
import { OrderStatus } from '@entities/order'
import { SortDirection } from '@shared/hooks'
import { ArrowUpDown } from 'lucide-react'
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
		children
	}: {
		column: OrderSortColumn
		children: React.ReactNode
	}) => {
		const isActive = sortColumn === column
		return (
			<th
				className='cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100'
				onClick={() => onSort(column)}
			>
				<div className='flex items-center gap-1.5'>
					{children}
					<ArrowUpDown
						className={`h-3.5 w-3.5 transition-all ${
							isActive
								? sortDirection === 'desc'
									? 'rotate-180 text-gray-700'
									: 'text-gray-700'
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
		if (currentStatus === newStatus) {
			return
		}

		setPendingChange({ orderId, currentStatus, newStatus })
	}

	const handleConfirm = () => {
		if (pendingChange) {
			onStatusChange(pendingChange.orderId, pendingChange.newStatus)
			setPendingChange(null)
		}
	}

	const handleCancel = () => {
		setPendingChange(null)
	}

	return (
		<>
			<div className='overflow-x-auto rounded-lg'>
				<table className='w-full'>
					<thead className='bg-gray-50'>
						<tr>
							<SortHeader column='id'>ID</SortHeader>
							<SortHeader column='user'>Пользователь</SortHeader>
							<SortHeader column='totalPrice'>Сумма</SortHeader>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Статус
							</th>
							<SortHeader column='createdAt'>Дата</SortHeader>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Действия
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{orders.map(order => (
							<tr key={order.id}>
								<td className='whitespace-nowrap px-6 py-4'>#{order.id}</td>
								<td className='px-6 py-4'>
									<div>
										<div className='font-medium text-gray-900'>
											{order.user.displayName}
										</div>
										<div className='text-sm text-gray-500'>
											{order.user.email}
										</div>
									</div>
								</td>
								<td className='whitespace-nowrap px-6 py-4 font-semibold'>
									${order.totalPrice}
								</td>
								<td className='whitespace-nowrap px-6 py-4'>
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
										className='rounded-lg border px-2 py-1 focus:outline-none'
									>
										<option value={OrderStatus.PENDING}>Ожидает оплаты</option>
										<option value={OrderStatus.PAYED}>Оплачено</option>
										<option value={OrderStatus.SHIPPED}>Отправлено</option>
										<option value={OrderStatus.DELIVERED}>Доставлено</option>
									</select>
								</td>
								<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
									{new Date(order.createdAt).toLocaleDateString('ru-RU')}
								</td>
								<td className='whitespace-nowrap px-6 py-4'>
									<button
										onClick={() => onViewDetails(order)}
										className='text-blue-600 hover:text-blue-800'
									>
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
					onClose={handleCancel}
					onConfirm={handleConfirm}
					currentStatus={pendingChange.currentStatus}
					newStatus={pendingChange.newStatus}
				/>
			)}
		</>
	)
}
