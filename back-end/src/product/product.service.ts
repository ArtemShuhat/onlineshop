import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '__generated__'
import { isMagnetURI } from 'class-validator'
import { PrismaService } from 'src/prisma/prisma.service'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { SearchService } from '@/search/search.service'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly searchService: SearchService
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
			filters.priceUSD = {}
			if (dto.minPrice) filters.priceUSD.gte = dto.minPrice
			if (dto.maxPrice) filters.priceUSD.lte = dto.maxPrice
		}

		let orderBy: Prisma.ProductOrderByWithRelationInput[] = []

		switch (dto.sortBy) {
			case 'price_high':
				orderBy = [{ priceUSD: 'desc' }]
				break
			case 'price_low':
				orderBy = [{ priceUSD: 'asc' }]
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

		let categoryName: string | null = null
		if (dto.categoryId) {
			const category = await this.prisma.category.findUnique({
				where: { id: dto.categoryId }
			})
			categoryName = category?.name || null
		}

		const searchKeywords = this.generateSearchKeywords(
			dto.name,
			dto.description,
			categoryName,
			dto.searchKeywords
		)

		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: slug,
				description: dto.description,
				priceUSD: dto.priceUSD,
				priceEUR: dto.priceEUR,
				priceUAH: dto.priceUAH,
				quantity: dto.quantity || 0,
				categoryId: dto.categoryId || null,
				searchKeywords: searchKeywords,
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

		await this.searchService.indexProduct(product.id)

		return product
	}

	async update(id: number, dto: UpdateProductDto) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: {
				productImages: true,
				category: true
			}
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

		if (
			dto.name ||
			dto.description ||
			dto.categoryId !== undefined ||
			dto.searchKeywords !== undefined
		) {
			let categoryName: string | null = product.category?.name || null

			if (dto.categoryId) {
				const category = await this.prisma.category.findUnique({
					where: { id: dto.categoryId }
				})
				categoryName = category?.name || null
			}

			const searchKeywords = this.generateSearchKeywords(
				dto.name || product.name,
				dto.description || product.description,
				categoryName,
				dto.searchKeywords
			)

			updateData.searchKeywords = searchKeywords
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

		await this.searchService.indexProduct(id)

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

		await this.searchService.removeProduct(id)

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

		await this.searchService.indexProduct(id)

		return updatedProduct
	}

	async findSimilar(id: number, limit: number) {
		const product = await this.prisma.product.findUnique({
			where: { id }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		const similarProducts = await this.prisma.product.findMany({
			where: {
				id: { not: id },
				isVisible: true,
				quantity: { gt: 0 },
				...(product.categoryId && { categoryId: product.categoryId })
			},
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			},
			orderBy: [{ quantity: 'desc' }, { createdAt: 'desc' }]
		})

		return similarProducts
	}

	private generateSearchKeywords(
		name: string,
		description: string,
		categoryName?: string | null,
		manualKeywords?: string[]
	): string[] {
		const keywords = new Set<string>()

		const nameWords = name
			.toLowerCase()
			.split(/[\s,.-]+/)
			.filter(word => word.length > 2)
		nameWords.forEach(word => keywords.add(word))

		keywords.add(name.toLowerCase())

		if (categoryName) {
			keywords.add(categoryName.toLowerCase())
			categoryName
				.toLowerCase()
				.split(/[\s,.-]+/)
				.filter(word => word.length > 2)
				.forEach(word => keywords.add(word))
		}

		const descWords = description
			.toLowerCase()
			.slice(0, 100)
			.split(/[\s,.-]+/)
			.filter(word => word.length > 3)
			.slice(0, 5)
		descWords.forEach(word => keywords.add(word))

		if (manualKeywords && manualKeywords.length > 0) {
			manualKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()))
		}

		return Array.from(keywords)
	}
}
