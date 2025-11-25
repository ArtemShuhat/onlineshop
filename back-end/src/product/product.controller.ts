import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductQueryDto } from './dto/product-query.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	// GET /products?searchTerm=phone&categoryId=1&minPrice=1000&maxPrice=5000
	// Получить все товары с фильтрами
	@Get()
	async findAll(@Query() dto: ProductQueryDto) {
		return this.productService.findAll(dto)
	}

	// GET /products/by-slug/iphone-15-pro
	// Получить товар по slug
	@Get('by-slug/:slug')
	async findBySlug(@Param('slug') slug: string) {
		return this.productService.findBySlug(slug)
	}

	// GET /products/:id
	// Получить товар по ID
	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.productService.findById(+id)
	}
}

