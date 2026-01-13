import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import { type Order, getAllOrders } from '@entities/order'

type OrdersFilters = {
	status?: string
	userId?: string
	search?: string
}

type UseOrdersOptions = Omit<
	UseQueryOptions<Order[], Error>,
	'queryKey' | 'queryFn'
>

export function useOrders(filters?: OrdersFilters, options?: UseOrdersOptions) {
	return useQuery({
		queryKey: ['admin-orders', filters],
		queryFn: () => getAllOrders(filters),
		...options
	})
}
