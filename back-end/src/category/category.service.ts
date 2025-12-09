import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.category.findMany({
			orderBy: {
				name: 'asc'
			},
			include: {
				_count: {
					select: { products: true }
				}
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
			where: { name: dto.name }
		})

		if (existing) {
			throw new ConflictException('Категория с таким названием уже существует')
		}

		return this.prisma.category.create({
			data: { name: dto.name }
		})
	}

	async updateCategory(id: number, name: string) {
		await this.findById(id)

		const existing = await this.prisma.category.findFirst({
			where: {
				name,
				id: {
					not: id
				}
			}
		})

		if (existing) {
			throw new ConflictException('Категория с таким названием уже существует')
		}

		return this.prisma.category.update({
			where: { id },
			data: { name }
		})
	}

	async deleteCategory(id: number) {
		const existing = await this.prisma.category.findUnique({
			where: { id }
		})

		if (!existing) {
			throw new ConflictException('Категория не найдена')
		}

		await this.prisma.category.delete({
			where: { id }
		})

		return { message: 'Категория успешно удалена' }
	}
}
