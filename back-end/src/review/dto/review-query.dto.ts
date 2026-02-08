import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class ReviewQueryDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(5)
	@Type(() => Number)
	rating?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	page?: number = 1

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	productId?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit?: number = 10
}
