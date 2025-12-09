import { IsString, MinLength } from 'class-validator'

export class UpdateCategoryDto {
	@IsString()
	@MinLength(2, { message: 'Название должно быть минимум 2 символа' })
	name: string
}
 