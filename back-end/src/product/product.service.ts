import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '__generated__'
import { PrismaService } from 'src/prisma/prisma.service'

import { ProductQueryDto } from './dto/product-query.dto'

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(dto: ProductQueryDto) {
		const filters: Prisma.ProductWhereInput = {}

		if (dto.searchTerm) {
			filters.OR = [
				{
					name: {
						contains: dto.searchTerm,
						mode: 'insensitive'
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

		if (dto.categoryId) {
			filters.categoryId = dto.categoryId
		}

		if (dto.minPrice || dto.maxPrice) {
			filters.price = {}

			if (dto.minPrice) {
				filters.price.gte = dto.minPrice
			}

			if (dto.maxPrice) {
				filters.price.lte = dto.maxPrice
			}
		}

		const products = await this.prisma.product.findMany({
			where: filters,
			include: {
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return products
	}

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
