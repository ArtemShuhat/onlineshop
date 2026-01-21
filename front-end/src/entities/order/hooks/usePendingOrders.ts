import { useQuery } from '@tanstack/react-query'

import { getPendingOrdersCount } from '@entities/order'

export function usePendingOrders() {
	return useQuery({
		queryKey: ['pendint-count'],
		queryFn: getPendingOrdersCount,
		refetchInterval: 30000,
		staleTime: 10000
	})
}
