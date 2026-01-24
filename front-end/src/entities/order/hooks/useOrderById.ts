import { Order, getOrderById } from '@entities/order'
import { useQuery } from '@tanstack/react-query'

export function useOrderById(orderId: number) {
	return useQuery<Order>({
		queryKey: ['order', orderId],
		queryFn: () => getOrderById(orderId),
		enabled: !!orderId
	})
}
