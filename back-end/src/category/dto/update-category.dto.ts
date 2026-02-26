import { IsString, MinLength } from 'class-validator'

export class UpdateCategoryDto {
	@IsString()
	@MinLength(2, { message: 'Название должно быть минимум 2 символа' })
	nameRu: string

	@IsString()
	@MinLength(1)
	nameEn: string

	@IsString()
	@MinLength(1)
	nameUk: string
}
