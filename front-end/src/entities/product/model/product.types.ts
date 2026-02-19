export type ProductSortBy = 'price_high' | 'price_low'

export interface ProductImage {
	id: number
	url: string
	isMain: boolean
	productId: number
	createdAt: string
}

export interface Product {
	id: number
	name: string
	slug: string
	description: string
	priceUSD: number
	priceEUR: number
	priceUAH: number
	quantity: number
	isVisible: boolean
	searchKeywords: string[]
	productImages: ProductImage[]
	categoryId: number | null
	category: {
		id: number
		name: string
	} | null
	averageRating: number
	reviewCount: number
	createdAt: string
	updatedAt: string
}

export interface ProductImageDto {
	url: string
	isMain?: boolean
}

export interface CreateProductDto {
	name: string
	description: string
	priceUSD: number
	priceEUR: number
	priceUAH: number
	quantity?: number
	categoryId?: number
	images: ProductImageDto[]
	searchKeywords?: string[]
	isVisible?: boolean
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
	isVisible?: boolean
}

export interface GetProductsParams {
	searchTerm?: string
	categoryId?: number
	minPrice?: number
	maxPrice?: number
	sortBy?: ProductSortBy
	includeHidden?: boolean
}
