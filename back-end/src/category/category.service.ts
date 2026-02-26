import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.category.findMany({
			orderBy: { nameRu: 'asc' },
			include: {
				_count: { select: { products: true } }
			}
		})
	}

	async findById(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			include: { products: true }
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}

	async createCategory(dto: CreateCategoryDto) {
		const existing = await this.prisma.category.findUnique({
			where: { nameRu: dto.nameRu }
		})

		if (existing) {
			throw new ConflictException('Категория с таким названием уже существует')
		}

		return this.prisma.category.create({
			data: {
				nameRu: dto.nameRu,
				nameEn: dto.nameEn,
				nameUk: dto.nameUk
			}
		})
	}

	async updateCategory(id: number, dto: UpdateCategoryDto) {
		await this.findById(id)

		const existing = await this.prisma.category.findFirst({
			where: { nameRu: dto.nameRu, id: { not: id } }
		})

		if (existing) {
			throw new ConflictException('Категория с таким названием уже существует')
		}

		return this.prisma.category.update({
			where: { id },
			data: {
				nameRu: dto.nameRu,
				nameEn: dto.nameEn,
				nameUk: dto.nameUk
			}
		})
	}

	async deleteCategory(id: number) {
		const existing = await this.prisma.category.findUnique({
			where: { id }
		})

		if (!existing) {
			throw new ConflictException('Категория не найдена')
		}

		await this.prisma.category.delete({ where: { id } })

		return { message: 'Категория успешно удалена' }
	}
}
