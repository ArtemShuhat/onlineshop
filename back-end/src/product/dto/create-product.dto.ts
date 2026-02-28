import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	IsArray,
	IsBoolean,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	MinLength,
	ValidateNested
} from 'class-validator'

export class ProductImageDto {
	@IsString({ message: 'URL изображения должен быть строкой' })
	url: string

	@IsOptional()
	@IsBoolean({ message: 'isMain должен быть булевым значением' })
	isMain?: boolean
}

export class ProductVariantAttributeDto {
	@IsString()
	key: string

	@IsString()
	name: string

	@IsString()
	value: string

	@IsString()
	valueLabel: string

	@IsOptional()
	@IsIn(['button', 'color'])
	displayType?: 'button' | 'color'

	@IsOptional()
	@IsString()
	colorHex?: string

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	sortOrder?: number
}

export class CreateProductDto {
	@IsString({ message: 'Название должно быть строкой' })
	name: string

	@IsString({ message: 'Описание на русском обязательно' })
	@MinLength(1)
	descriptionRu: string

	@IsString({ message: 'Описание на английском обязательно' })
	@MinLength(1)
	descriptionEn: string

	@IsString({ message: 'Описание украинским обязательно' })
	@MinLength(1)
	descriptionUk: string

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

	@IsOptional()
	@IsBoolean()
	isVisible?: boolean

	@IsOptional()
	@IsString()
	variantGroupKey?: string

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductVariantAttributeDto)
	variantAttributes?: ProductVariantAttributeDto[]
}
