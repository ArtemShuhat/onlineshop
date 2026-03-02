import { BannerSlot } from '__generated__'
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString
} from 'class-validator'

export class CreateBannerDto {
	@IsString()
	url: string

	@IsOptional()
	@IsInt()
	order?: number

	@IsOptional()
	@IsEnum(BannerSlot)
	slot?: BannerSlot
}

export class UpdateBannerDto {
	@IsOptional()
	@IsString()
	url?: string

	@IsOptional()
	@IsInt()
	order?: number

	@IsOptional()
	@IsBoolean()
	isActive?: boolean

	@IsOptional()
	@IsEnum(BannerSlot)
	slot?: BannerSlot
}

export class ReorderBannerDto {
	@IsArray()
	bannerIds: number[]
}
