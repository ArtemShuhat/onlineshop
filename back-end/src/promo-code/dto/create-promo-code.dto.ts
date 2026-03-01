import {
	IsBoolean,
	IsInt,
	IsISO8601,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator'

export class CreatePromoCodeDto {
	@IsOptional()
	@IsString()
	code?: string

	@IsInt()
	@Min(1)
	@Max(100)
	percentOff: number

	@IsOptional()
	@IsInt()
	@Min(0)
	minOrderAmount?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	maxUses?: number

	@IsOptional()
	@IsISO8601()
	startsAt?: string

	@IsOptional()
	@IsISO8601()
	expiresAt?: string

	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
