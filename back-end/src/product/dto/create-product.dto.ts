import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested
} from 'class-validator'

export class ProductImageDto {
	@IsString({ message: 'URL изображения должен быть строкой' })
	url: string

	@IsOptional()
	@IsBoolean({ message: 'isMain должен быть булевым значением' })
	isMain?: boolean
}

export class CreateProductDto {
	@IsString({ message: 'Название должно быть строкой' })
	name: string

	@IsString({ message: 'Описание должно быть строкой' })
	description: string

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	price: number

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	priceUSD: number

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	priceEUR: number

	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	priceUAH: number

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
	@ValidateNested({ each: true })
	@Type(() => ProductImageDto)
	@ArrayMaxSize(10, { message: 'Максимум можно загрузить 10 изображений' })
	images: ProductImageDto[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	searchKeywords?: string[]
}
