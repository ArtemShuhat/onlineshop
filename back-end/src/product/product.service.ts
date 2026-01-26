import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '__generated__'
import { PrismaService } from 'src/prisma/prisma.service'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	async findAll(dto: ProductQueryDto) {
		const filters: Prisma.ProductWhereInput = {}

		if (dto.searchTerm) {
			filters.OR = [
				{
					name: {
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

		let orderBy: Prisma.ProductOrderByWithRelationInput[] = []

		switch (dto.sortBy) {
			case 'price_high':
				orderBy = [{ price: 'desc' }]
				break
			case 'price_low':
				orderBy = [{ price: 'asc' }]
				break
			default:
				orderBy = [{ quantity: 'desc' }, { createdAt: 'desc' }]
		}

		const products = await this.prisma.product.findMany({
			where: {
				...filters,
				...(dto.includeHidden ? {} : { isVisible: true })
			},
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			},
			orderBy
		})

		return products
	}

	async findBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
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
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
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

		const images = dto.images.map((img, index) => ({
			url: img.url,
			isMain: img.isMain ?? index === 0
		}))

		const mainImages = images.filter(img => img.isMain)
		if (mainImages.length > 1) {
			images.forEach((img, index) => {
				img.isMain = index === images.findIndex(i => i.isMain)
			})
		}

		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: slug,
				description: dto.description,
				price: dto.price,
				quantity: dto.quantity || 0,
				categoryId: dto.categoryId || null,
				productImages: {
					create: images
				}
			},
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			}
		})

		return product
	}

	async update(id: number, dto: UpdateProductDto) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: { productImages: true }
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

		const updateData: any = {
			...(dto.name && { name: dto.name, slug }),
			...(dto.description && { description: dto.description }),
			...(dto.price !== undefined && { price: dto.price }),
			...(dto.quantity !== undefined && { quantity: dto.quantity }),
			...(dto.categoryId !== undefined && { categoryId: dto.categoryId })
		}

		if (dto.images) {
			const oldImageUrls = product.productImages.map(img => img.url)
			const newImageUrls = dto.images.map(img => img.url)

			const deletedImageUrls = oldImageUrls.filter(
				url => !newImageUrls.includes(url)
			)

			if (deletedImageUrls.length > 0) {
				await this.cloudinaryService.deleteMultipleImages(deletedImageUrls)
			}

			const images = dto.images.map((img, index) => ({
				url: img.url,
				isMain: img.isMain ?? index === 0
			}))

			const mainImages = images.filter(img => img.isMain)
			if (mainImages.length > 1) {
				images.forEach((img, index) => {
					img.isMain = index === images.findIndex(i => i.isMain)
				})
			}

			updateData.productImages = {
				deleteMany: {},
				create: images
			}
		}

		const updatedProduct = await this.prisma.product.update({
			where: { id },
			data: updateData,
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			}
		})

		return updatedProduct
	}

	async delete(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: { productImages: true }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		const imageUrls = product.productImages.map(img => img.url)
		await this.cloudinaryService.deleteMultipleImages(imageUrls)

		await this.prisma.product.delete({
			where: { id }
		})

		return { message: 'Товар упешно удален' }
	}

	async toggleVisibility(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		const updatedProduct = await this.prisma.product.update({
			where: { id },
			data: { isVisible: !product.isVisible },
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			}
		})

		return updatedProduct
	}
}
