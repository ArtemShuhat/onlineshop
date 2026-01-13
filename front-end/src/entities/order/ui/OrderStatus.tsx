import { OrderStatus as OrderStatusEnum } from '@entities/order'

interface OrderStatusProps {
	status: OrderStatusEnum
}

const statusConfig = {
	[OrderStatusEnum.PENDING]: {
		label: 'Ожидает оплаты',
		color: 'bg-yellow-100 text-yellow-800'
	},
	[OrderStatusEnum.PAYED]: {
		label: 'Оплачено',
		color: 'bg-green-100 text-green-800'
	},
	[OrderStatusEnum.SHIPPED]: {
		label: 'Отправлено',
		color: 'bg-blue-100 text-blue-800'
	},
	[OrderStatusEnum.DELIVERED]: {
		label: 'Доставлено',
		color: 'bg-gray-100 text-gray-800'
	}
}

export function OrderStatusBadge({ status }: OrderStatusProps) {
	const config = statusConfig[status]

	return (
		<span
			className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${config.color}`}
		>
			{config.label}
		</span>
	)
}
