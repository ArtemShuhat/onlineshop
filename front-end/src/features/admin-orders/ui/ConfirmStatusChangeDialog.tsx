'use client'

import { OrderStatus } from '@entities/order'
import { ConfirmDialog } from '@shared/ui'
import { ArrowRight } from 'lucide-react'

interface ConfirmStatusChangeDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	currentStatus: OrderStatus
	newStatus: OrderStatus
}

const statusLabels: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'Ожидает оплаты',
	[OrderStatus.PAYED]: 'Оплачено',
	[OrderStatus.SHIPPED]: 'Отправлено',
	[OrderStatus.DELIVERED]: 'Доставлено'
}

const statusColors: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	[OrderStatus.PAYED]: 'bg-green-100 text-green-800 border-green-200',
	[OrderStatus.SHIPPED]: 'bg-blue-100 text-blue-800 border-blue-200',
	[OrderStatus.DELIVERED]: 'bg-purple-100 text-purple-800 border-purple-200'
}

export function ConfirmStatusChangeDialog({
	isOpen,
	onClose,
	onConfirm,
	currentStatus,
	newStatus
}: ConfirmStatusChangeDialogProps) {
	return (
		<ConfirmDialog
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={onConfirm}
			title='Изменить статус заказа?'
			description='Вы уверены, что хотите изменить статус заказа? Это действие важно для отслеживания заказа.'
			confirmText='Изменить статус'
			cancelText='Отмена'
			variant='warning'
		>
			<div className='space-y-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-4'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-xs font-medium text-gray-500'>Текущий статус</p>
						<div
							className={`mt-1 inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${statusColors[currentStatus]}`}
						>
							{statusLabels[currentStatus]}
						</div>
					</div>

					<ArrowRight className='h-5 w-5 flex-shrink-0 text-gray-400' />

					<div>
						<p className='text-xs font-medium text-gray-500'>Новый статус</p>
						<div
							className={`mt-1 inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${statusColors[newStatus]}`}
						>
							{statusLabels[newStatus]}
						</div>
					</div>
				</div>
				<div className='rounded-lg bg-blue-50 p-3'>
					<p className='text-xs font-medium text-blue-900'>
						{newStatus === OrderStatus.PAYED && '💳 Клиент оплатил заказ'}
						{newStatus === OrderStatus.SHIPPED && '🚚 Заказ отправлен клиенту'}
						{newStatus === OrderStatus.DELIVERED && '🎉 Заказ доставлен'}
						{newStatus === OrderStatus.PENDING && '⏳ Заказ ожидает оплаты'}
					</p>
				</div>
			</div>
		</ConfirmDialog>
	)
}
