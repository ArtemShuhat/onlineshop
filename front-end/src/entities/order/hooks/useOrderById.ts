import { useQuery } from '@tanstack/react-query'

import { getOrderById } from '../api/orderApi'

export function useOrderById(orderId: number) {
	return useQuery({
		queryKey: ['order', orderId],
		queryFn: () => getOrderById(orderId),
		enabled: !!orderId
	})
}
