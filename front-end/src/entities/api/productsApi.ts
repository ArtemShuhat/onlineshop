const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
	
export type ProductSortBy = 'newest' | 'oldest' | 'price_high' | 'price_low'

export interface Product {
	id: number
	name: string
	slug: string
	description: string
	price: number
	quantity: number
	images: string[]
	categoryId?: number
	category?: {
		id: number
		name: string
	}
	createdAt: string
	updatedAt: string
}

export interface CreateProductDto {
	name: string
	description: string
	price: number
	quantity?: number
	categoryId?: number
	images: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export async function getProducts(params?: {
	searchTerm?: string
	categoryId?: number
	maxPrice?: number
	minPrice?: number
	sortBy?: ProductSortBy
}): Promise<Product[]> {
	const queryParams = new URLSearchParams()

	if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm)
	if (params?.categoryId)
		queryParams.append('categoryId', String(params.categoryId))
	if (params?.minPrice) queryParams.append('minPrice', String(params.minPrice))
	if (params?.maxPrice) queryParams.append('maxPrice', String(params.maxPrice))
	if (params?.sortBy) queryParams.append('sortBy', params.sortBy)

	const response = await fetch(`${SERVER_URL}/products?${queryParams}`)

	if (!response.ok) {
		throw new Error('Ошибка при загрузке товара')
	}

	return response.json()
}

export async function createProducts(data: CreateProductDto): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при загрузке товара')
	}

	return response.json()
}

export async function updateProducts(
	id: number,
	data: UpdateProductDto
): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при обновлении товара')
	}

	return response.json()
}

export async function deleteProducts(id: number): Promise<void> {
	const response = await fetch(`${SERVER_URL}/products/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при удалении товара')
	}
}

export async function getProductBySlug(slug: string): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products/by-slug/${slug}`)

	if (!response.ok) {
		throw new Error('Товар не найден')
	}

	return response.json()
}
