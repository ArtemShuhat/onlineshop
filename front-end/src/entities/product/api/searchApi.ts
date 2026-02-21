const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface SearchProductsParams {
	q: string
	categoryId?: number
	minPrice?: number
	maxPrice?: number
	sortBy?: 'price_high' | 'price_low'
	limit?: number
}

export interface SearchResult {
	id: number
	name: string
	slug: string
	description: string
	priceUSD: number
	priceEUR: number
	priceUAH: number
	quantity: number
	categoryId: number | null
	categoryName: string | null
	imageUrl: string | null
	isVisible: boolean
	searchKeywords: string[]
}

export interface SearchResponse {
	hits: SearchResult[]
	totalHits: number
	query: string
	processingTimeMs?: number
	processgTimeMs?: number
}

export async function searchProducts(
	params: SearchProductsParams,
	init?: RequestInit
): Promise<SearchResponse> {
	const queryParams = new URLSearchParams()

	queryParams.append('q', params.q)
	if (params.categoryId)
		queryParams.append('categoryId', String(params.categoryId))
	if (params.minPrice) queryParams.append('minPrice', String(params.minPrice))
	if (params.maxPrice) queryParams.append('maxPrice', String(params.maxPrice))
	if (params.sortBy) queryParams.append('sortBy', params.sortBy)
	if (params.limit) queryParams.append('limit', String(params.limit))

	const response = await fetch(`${SERVER_URL}/search?${queryParams}`, init)

	if (!response.ok) {
		throw new Error('Ошибка при поиске товаров')
	}

	return response.json()
}
