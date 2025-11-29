import { Controller, Get, Param, Query } from '@nestjs/common'

import { ProductQueryDto } from './dto/product-query.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async findAll(@Query() dto: ProductQueryDto) {
		return this.productService.findAll(dto)
	}

	@Get('by-slug/:slug')
	async findBySlug(@Param('slug') slug: string) {
		return this.productService.findBySlug(slug)
	}

	@Get(':id')
	async findById(@Param('id') id: number) {
		return this.productService.findById(id)
	}
}
