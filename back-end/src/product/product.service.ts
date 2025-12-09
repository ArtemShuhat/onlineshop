import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '__generated__'
import { PrismaService } from 'src/prisma/prisma.service'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'

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
			orderBy: [{ quantity: 'desc' }, { createdAt: 'desc' }]
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

	async create(dto: CreateProductDto) {
		const existingProduct = await this.prisma.product.findUnique({
			where: {
				name: dto.name
			}
		})

		if (existingProduct) {
			throw new ConflictException('Товар с таким названием уже существует')
		}

		const slug = dto.name
			.toLowerCase()
			.replace(/[^a-zа-я0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.trim()

		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: slug,
				description: dto.description,
				price: dto.price,
				quantity: dto.quantity || 0,
				images: dto.images,
				categoryId: dto.categoryId || null
			},
			include: {
				category: true
			}
		})

		return product
	}

	async update(id: number, dto: UpdateProductDto) {
		const product = await this.prisma.product.findUnique({
			where: { id }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		let slug = product.slug
		if (dto.name && dto.name !== product.name) {
			const existingProduct = await this.prisma.product.findUnique({
				where: { name: dto.name }
			})

			if (existingProduct && existingProduct.id !== id) {
				throw new ConflictException('Товар с таким названием уже существует')
			}

			slug = dto.name
				.toLowerCase()
				.replace(/[^a-zа-я0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.trim()
		}

		const updatedProduct = await this.prisma.product.update({
			where: { id },
			data: {
				...(dto.name && { name: dto.name, slug }),
				...(dto.description && { description: dto.description }),
				...(dto.price !== undefined && { price: dto.price }),
				...(dto.quantity !== undefined && { quantity: dto.quantity }),
				...(dto.images && { images: dto.images }),
				...(dto.categoryId !== undefined && { categoryId: dto.categoryId })
			},
			include: {
				category: true
			}
		})

		return updatedProduct
	}

	async delete(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		await this.prisma.product.delete({
			where: { id }
		})

		return { message: 'Товар упешно удален' }
	}
}
