import type {
	CreateProductDto,
	GetProductsParams,
	Product,
	UpdateProductDto
} from '@entities/product'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function getProducts(
	params?: GetProductsParams,
	init?: RequestInit
): Promise<Product[]> {
	const queryParams = new URLSearchParams()

	if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm)
	if (params?.categoryId)
		queryParams.append('categoryId', String(params.categoryId))
	if (params?.minPrice) queryParams.append('minPrice', String(params.minPrice))
	if (params?.maxPrice) queryParams.append('maxPrice', String(params.maxPrice))
	if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
	if (params?.includeHidden)
		queryParams.append('includeHidden', String(params.includeHidden))

	const response = await fetch(`${SERVER_URL}/products?${queryParams}`, init)

	if (!response.ok) {
		throw new Error('Ошибка при загрузке товара')
	}

	return response.json()
}

export async function getProductById(
	productId: number,
	init?: RequestInit
): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products/${productId}`, {
		...init,
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Товар не найден')
	}

	return response.json()
}

export async function createProduct(data: CreateProductDto): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при создании товара')
	}

	return response.json()
}

export async function updateProduct(
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

export async function deleteProduct(id: number): Promise<void> {
	const response = await fetch(`${SERVER_URL}/products/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при удалении товара')
	}
}

export async function getProductBySlug(
	slug: string,
	init?: RequestInit
): Promise<Product> {
	const response = await fetch(`${SERVER_URL}/products/by-slug/${slug}`, init)

	if (!response.ok) {
		throw new Error('Товар не найден')
	}

	return response.json()
}

export async function toggleProductVisibility(id: number): Promise<Product> {
	const response = await fetch(
		`${SERVER_URL}/products/${id}/toggle-visibility`,
		{
			method: 'PATCH',
			credentials: 'include'
		}
	)

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при изменении видимости товара')
	}

	return response.json()
}

export async function getSimilarProducts(
	id: number,
	limit: number = 4,
	init?: RequestInit
): Promise<Product[]> {
	const queryParams = limit ? `?limit=${limit}` : ''

	const response = await fetch(
		`${SERVER_URL}/products/${id}/similar${queryParams}`,
		init
	)

	if (!response.ok) {
		throw new Error('Ошибка при загрузке похожих товаров')
	}

	return response.json()
}
