export type ProductSortBy = 'price_high' | 'price_low'

export interface ProductImage {
	id: number
	url: string
	isMain: boolean
	createdAt: string
}

export interface Product {
	id: number
	name: string
	slug: string
	description: string
	price: number
	quantity: number
	isVisible: boolean
	productImages: ProductImage[]
	categoryId?: number
	category?: {
		id: number
		name: string
	}
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
	price: number
	quantity?: number
	categoryId?: number
	images: ProductImageDto[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface GetProductsParams {
	searchTerm?: string
	categoryId?: number
	minPrice?: number
	maxPrice?: number
	sortBy?: ProductSortBy
	includeHidden?: boolean
}
