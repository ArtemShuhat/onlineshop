import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	// Получить все категории
	async findAll() {
		return this.prisma.category.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	// Получить одну категорию по ID
	async findById(id: number) {
		return this.prisma.category.findUnique({
			where: { id },
			include: {
				products: true // Включаем товары этой категории
			}
		})
	}
}

