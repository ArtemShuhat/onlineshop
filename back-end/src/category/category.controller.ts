import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common'

import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async findAll() {
		return this.categoryService.findAll()
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.categoryService.findById(+id)
	}

	@Post()
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoryService.createCategory(dto)
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.categoryService.updateCategory(+id, dto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.deleteCategory(+id)
	}
}
