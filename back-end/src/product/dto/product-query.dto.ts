import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

// DTO = Data Transfer Object (объект для передачи данных)
// Это описывает какие параметры можно передать при запросе товаров

export class ProductQueryDto {
	// Поиск по названию
	@IsOptional()
	@IsString()
	searchTerm?: string

	// Фильтр по категории
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	categoryId?: number

	// Минимальная цена
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	minPrice?: number

	// Максимальная цена
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	maxPrice?: number
}

