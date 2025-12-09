import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	Min
} from 'class-validator'

export class CreateProductDto {
	@IsString({ message: 'Название должно быть строкой' })
	name: string

	@IsString({ message: 'Описание должно быть строкой' })
	description: string

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	price: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество не может быть отрицательным' })
	quantity: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber({}, { message: 'ID категории должен быть числом' })
	categoryId: number

	@IsArray({ message: 'Изображения должны быть массивом' })
	@IsString({ each: true, message: 'Каждое изображение должно быть строкой' })
	@ArrayMaxSize(10, { message: 'Максимум можно загрузить 10 изображений' })
	images: string[]
}
