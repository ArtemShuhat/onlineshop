export type ProductSortBy = 'price_high' | 'price_low'
export type VariantDisplayType = 'button' | 'color'

export interface ProductImage {
	id: number
	url: string
	isMain: boolean
	productId: number
	createdAt: string
}

export interface ProductVariantAttribute {
	key: string
	name: string
	value: string
	valueLabel: string
	displayType?: VariantDisplayType
	colorHex?: string | null
	sortOrder?: number
}

export interface ProductVariantAxisValue {
	value: string
	label: string
	colorHex?: string | null
	sortOrder?: number
}

export interface ProductVariantAxis {
	key: string
	name: string
	displayType: VariantDisplayType
	values: ProductVariantAxisValue[]
}

export interface ProductSiblingVariant {
	id: number
	name: string
	slug: string
	quantity: number
	priceUSD: number
	priceEUR: number
	priceUAH: number
	productImages: ProductImage[]
	variantAttributes: ProductVariantAttribute[]
}

export interface Product {
	id: number
	name: string
	slug: string
	descriptionRu: string
	descriptionEn: string
	descriptionUk: string
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
		nameRu: string
		nameEn: string
		nameUk: string
	} | null
	averageRating: number
	reviewCount: number
	createdAt: string
	updatedAt: string
	variantGroupKey?: string | null
	variantAttributes?: ProductVariantAttribute[]
	variantAxes?: ProductVariantAxis[]
	siblingVariants?: ProductSiblingVariant[]
}

export interface ProductImageDto {
	url: string
	isMain?: boolean
}

export interface CreateProductDto {
	name: string
	descriptionRu: string
	descriptionEn: string
	descriptionUk: string
	priceUSD: number
	priceEUR: number
	priceUAH: number
	quantity?: number
	categoryId?: number
	images: ProductImageDto[]
	searchKeywords?: string[]
	isVisible?: boolean
	variantGroupKey?: string
	variantAttributes?: ProductVariantAttribute[]
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
