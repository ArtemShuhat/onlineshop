import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateOrderStatus } from '@/entities/order'
import { OrderStatus } from '@/entities/order'

export function useUpdateOrderStatus() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			orderId,
			status
		}: {
			orderId: number
			status: OrderStatus
		}) => updateOrderStatus(orderId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
		}
	})
}
