import { IsString, MinLength } from 'class-validator'

export class CreateCategoryDto {
	@IsString()
	@MinLength(2, { message: 'Название должно быть минимум 2 символа' })
	nameRu: string

	@IsString()
	@MinLength(1, { message: 'Введите название на английском' })
	nameEn: string

	@IsString()
	@MinLength(1, { message: 'Введіть назву українською' })
	nameUk: string
}
