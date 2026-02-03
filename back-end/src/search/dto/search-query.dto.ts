import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString, MinLength } from "class-validator"

export enum SearchSortBy {
	PRICE_HIGH = 'price_high',
	PRICE_LOW = 'price_low'
}

export class SearchQueryDto {
	@IsString()
	@MinLength(1)
	q: string

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
	@IsEnum(SearchSortBy)
	sortBy?: SearchSortBy

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	limit?: number
}
