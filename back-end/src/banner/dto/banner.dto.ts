import { IsBoolean, IsInt, IsOptional, IsUrl, Min } from 'class-validator'

export class CreateBannerDto {
	@IsUrl()
	url: string

	@IsInt()
	@Min(0)
	@IsOptional()
	order?: number
}

export class UpdateBannerDto {
	@IsUrl()
	url?: string

	@IsInt()
	@Min(0)
	@IsOptional()
	order?: number

	@IsBoolean()
	@IsOptional()
	isActive?: boolean
}

export class ReorderBannerDto {
	@IsInt({ each: true })
	bannerIds: number[]
}
