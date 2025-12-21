'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/shared/components/ui/dialog'

import { OrderStatus } from '@/entities/order'

interface ConfirmStatusChangeDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	currentStatus: OrderStatus
	newStatus: OrderStatus
}

export function ConfirmStatusChangeDialog({
	isOpen,
	onClose,
	onConfirm,
	currentStatus,
	newStatus
}: ConfirmStatusChangeDialogProps) {
	const statusLabels: Record<OrderStatus, string> = {
		[OrderStatus.PENDING]: 'Ожидает оплаты',
		[OrderStatus.PAYED]: 'Оплачено',
		[OrderStatus.SHIPPED]: 'Отправлено',
		[OrderStatus.DELIVERED]: 'Доставлено'
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Подтверждение изменения статуса</DialogTitle>
					<DialogDescription className='pt-4 text-base'>
						Вы уверены, что хотите изменить статус заказа? Вернуть старый статус
						после выбора нового будет не возможно.
					</DialogDescription>
					<div className='pt-4 text-sm'>
						<p className='text-gray-600'>
							<span className='font-medium'>Текущий статус:</span>{' '}
							{statusLabels[currentStatus]}
						</p>
						<p className='text-gray-600'>
							<span className='font-medium'>Новый статус:</span>{' '}
							{statusLabels[newStatus]}
						</p>
					</div>
				</DialogHeader>
				<DialogFooter className='mt-6'>
					<button
						onClick={onClose}
						className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						Отмена
					</button>
					<button
						onClick={() => {
							onConfirm()
							onClose()
						}}
						className='bg-pur hover:bg-purh rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						Изменить
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
