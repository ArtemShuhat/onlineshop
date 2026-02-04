import { getProductById } from '@entities/product'
import { useQuery } from '@tanstack/react-query'

export function useProductById(id: number) {
	return useQuery({
		queryKey: ['product', id],
		queryFn: () => getProductById(id),
		enabled: !!id && id > 0,
		staleTime: 30 * 1000
	})
}
