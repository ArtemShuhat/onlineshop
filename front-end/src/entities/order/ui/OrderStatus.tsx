'use client'

import { OrderStatus as OrderStatusEnum } from '@entities/order'
import { useTranslations } from 'next-intl'

interface OrderStatusProps {
	status: OrderStatusEnum
}

const statusConfig = {
	[OrderStatusEnum.PENDING]: {
		labelKey: 'pending',
		color: 'bg-yellow-100 text-yellow-800'
	},
	[OrderStatusEnum.PAYED]: {
		labelKey: 'payed',
		color: 'bg-green-100 text-green-800'
	},
	[OrderStatusEnum.SHIPPED]: {
		labelKey: 'shipped',
		color: 'bg-blue-100 text-blue-800'
	},
	[OrderStatusEnum.DELIVERED]: {
		labelKey: 'delivered',
		color: 'bg-gray-100 text-gray-800'
	}
} as const

export function OrderStatusBadge({ status }: OrderStatusProps) {
	const t = useTranslations('orderStatus')
	const config = statusConfig[status]

	return (
		<span
			className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${config.color}`}
		>
			{t(config.labelKey)}
		</span>
	)
}
