import { Transform, Type } from 'class-transformer'
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'

export enum ProductSortBy {
	PRICE_HIGH = 'price_high',
	PRICE_LOW = 'price_low'
}

export class ProductQueryDto {
	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	categoryId?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	minPrice?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	maxPrice?: number

	@IsOptional()
	@IsEnum(ProductSortBy)
	sortBy?: ProductSortBy

	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	@IsBoolean()
	includeHidden?: boolean
}
