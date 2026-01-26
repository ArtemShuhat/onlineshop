import {
	Body,
	Controller,
	Delete,
	Get,
	Ip,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards
} from '@nestjs/common'
import { UserRole } from '__generated__'
import { Request } from 'express'

import { AnalyticsService } from '@/analytics/analytics.service'
import { Roles } from '@/auth/decorators/roles.decorator'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { RolesGuard } from '@/auth/guards/roles.guard'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly analyticsService: AnalyticsService
	) {}

	// public
	@Get()
	async findAll(@Query() dto: ProductQueryDto) {
		return this.productService.findAll(dto)
	}

	@Get('by-slug/:slug')
	async findBySlug(
		@Param('slug') slug: string,
		@Ip() ip: string,
		@Req() req: Request
	) {
		const product = await this.productService.findBySlug(slug)
		const identifier =
			ip || req.headers['x-forwarded-for']?.toString() || 'unknown'
		await this.analyticsService.trackProductView(product.id, identifier)

		return product
	}

	@Get(':id')
	async findById(@Param('id') id: number) {
		return this.productService.findById(id)
	}

	@Get(':id/similar')
	async findSimilar(@Param('id') id: string, @Query('limit') limit?: string) {
		return this.productService.findSimilar(+id, limit ? +limit : 4)
	}

	//admin
	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto)
	}

	@Patch(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN) // prob can change id: string -> number
	async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.productService.update(+id, dto)
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN) // prob can change id: string -> number
	async delete(@Param('id') id: string) {
		return this.productService.delete(+id)
	}

	@Patch(':id/toggle-visibility')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async toggleVisibility(@Param('id') id: string) {
		return this.productService.toggleVisibility(+id)
	}
}
