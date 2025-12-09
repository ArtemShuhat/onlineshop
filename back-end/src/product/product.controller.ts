import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'
import { UserRole } from '__generated__'

import { Roles } from '@/auth/decorators/roles.decorator'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { RolesGuard } from '@/auth/guards/roles.guard'
import { UpdateUserDto } from '@/user/dto/update-user.dto'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	// public
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
}
