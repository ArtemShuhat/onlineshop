import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'


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
}


