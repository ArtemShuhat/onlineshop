import { IsString, MinLength } from 'class-validator'

export class CreateCategoryDto {
	@IsString()
	@MinLength(2, { message: 'Название должно быть минимум 2 символа' })
	name: string
}
