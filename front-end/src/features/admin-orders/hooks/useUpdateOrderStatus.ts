import { updateOrderStatus } from '@entities/order'
import { OrderStatus } from '@entities/order'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
