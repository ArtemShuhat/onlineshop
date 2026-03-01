import { IsNotEmpty, IsString } from 'class-validator'

export class ValidatePromoCodeDto {
	@IsString()
	@IsNotEmpty()
	code: string
}
