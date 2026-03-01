import { IsBoolean } from 'class-validator'

export class UpdatePromoCodeStatusDto {
	@IsBoolean()
	isActive: boolean
}
