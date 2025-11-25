import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '__generated__'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProductQueryDto } from './dto/product-query.dto'

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	// Получить все товары с фильтрами
	async findAll(dto: ProductQueryDto) {
		// Создаём объект для фильтрации
		const filters: Prisma.ProductWhereInput = {}

		// Если есть поиск по названию
		if (dto.searchTerm) {
			filters.OR = [
				{
					name: {
						contains: dto.searchTerm,
						mode: 'insensitive' // без учёта регистра
					}
				},
				{
					description: {
						contains: dto.searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}

		// Фильтр по категории
		if (dto.categoryId) {
			filters.categoryId = dto.categoryId
		}

		// Фильтр по цене
		if (dto.minPrice || dto.maxPrice) {
			filters.price = {}

			if (dto.minPrice) {
				filters.price.gte = dto.minPrice // gte = greater than or equal (больше или равно)
			}

			if (dto.maxPrice) {
				filters.price.lte = dto.maxPrice // lte = less than or equal (меньше или равно)
			}
		}

		// Получаем товары из базы данных
		const products = await this.prisma.product.findMany({
			where: filters,
			include: {
				category: true // Включаем информацию о категории
			},
			orderBy: {
				createdAt: 'desc' // Сортируем по дате создания (новые первые)
			}
		})

		return products
	}

	// Получить один товар по slug (например: "iphone-15-pro")
	async findBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			include: {
				category: true
			}
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		return product
	}

	// Получить один товар по ID
	async findById(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: {
				category: true
			}
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		return product
	}
}

