import { useQuery } from '@tanstack/react-query'

import { type Product, getProducts } from '@/entities/api/productsApi'

export function useSearchProducts(searchTerm: string) {
	return useQuery<Product[]>({
		queryKey: ['products', 'search', searchTerm],
		queryFn: () => getProducts({ searchTerm }),
		enabled: searchTerm.length >= 2,
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000
	})
}
