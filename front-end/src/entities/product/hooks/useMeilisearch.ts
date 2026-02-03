import { SearchProductsParams, searchProducts } from '@entities/product'
import { useQuery } from '@tanstack/react-query'

export function useMeilisearch(params: SearchProductsParams) {
	return useQuery({
		queryKey: ['meiliesearch', params],
		queryFn: () => searchProducts(params),
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000
	})
}
