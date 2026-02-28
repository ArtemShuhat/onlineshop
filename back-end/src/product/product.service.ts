import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '__generated__'
import { PrismaService } from 'src/prisma/prisma.service'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { SearchService } from '@/search/search.service'

import { CreateProductDto } from './dto/create-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { UpdateProductDto } from './dto/update-product.dto'

type NormalizedVariantAttribute = {
	key: string
	name: string
	value: string
	valueLabel: string
	displayType: 'button' | 'color'
	colorHex: string | null
	sortOrder: number
}

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

		return dto.includeHidden ? products : this.groupPublicProducts(products)
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

		return this.attachVariantPayload(product, true)
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

		return this.attachVariantPayload(product, false)
	}

	async create(dto: CreateProductDto) {
		const normalizedVariantAttributes =
			dto.variantAttributes && dto.variantAttributes.length > 0
				? dto.variantAttributes.map(attr => this.normalizeVariantAttribute(attr))
				: []

		const slug = await this.ensureUniqueSlug(
			this.buildProductSlug(dto.name, normalizedVariantAttributes)
		)

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
			categoryName = category?.nameRu || null
		}

		const searchKeywords = this.generateSearchKeywords(
			dto.name,
			dto.descriptionRu,
			categoryName,
			dto.searchKeywords
		)

		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug,
				descriptionRu: dto.descriptionRu,
				descriptionEn: dto.descriptionEn,
				descriptionUk: dto.descriptionUk,
				priceUSD: dto.priceUSD,
				priceEUR: dto.priceEUR,
				priceUAH: dto.priceUAH,
				quantity: dto.quantity || 0,
				categoryId: dto.categoryId || null,
				searchKeywords,
				productImages: { create: images },
				variantGroupKey: dto.variantGroupKey?.trim() || null,
				variantAttributes:
					normalizedVariantAttributes.length > 0
						? normalizedVariantAttributes
						: null
			},
			include: {
				category: true,
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			}
		})

		await this.searchService.indexProduct(product.id)

		return this.attachVariantPayload(product, false)
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

		const normalizedVariantAttributes =
			dto.variantAttributes !== undefined
				? dto.variantAttributes.length > 0
					? dto.variantAttributes.map(attr =>
							this.normalizeVariantAttribute(attr)
						)
					: []
				: this.parseVariantAttributes(product.variantAttributes)

		const nextName = dto.name ?? product.name
		const shouldRegenerateSlug =
			dto.name !== undefined || dto.variantAttributes !== undefined

		const slug = shouldRegenerateSlug
			? await this.ensureUniqueSlug(
					this.buildProductSlug(nextName, normalizedVariantAttributes),
					id
				)
			: product.slug

		const updateData: Prisma.ProductUpdateInput = {
			...(dto.name && { name: dto.name }),
			...(shouldRegenerateSlug && { slug }),
			...(dto.descriptionRu && { descriptionRu: dto.descriptionRu }),
			...(dto.descriptionEn !== undefined && {
				descriptionEn: dto.descriptionEn
			}),
			...(dto.descriptionUk !== undefined && {
				descriptionUk: dto.descriptionUk
			}),
			...(dto.priceUSD !== undefined && { priceUSD: dto.priceUSD }),
			...(dto.priceEUR !== undefined && { priceEUR: dto.priceEUR }),
			...(dto.priceUAH !== undefined && { priceUAH: dto.priceUAH }),
			...(dto.quantity !== undefined && { quantity: dto.quantity }),
			...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
			...(dto.variantGroupKey !== undefined && {
				variantGroupKey: dto.variantGroupKey?.trim() || null
			}),
			...(dto.variantAttributes !== undefined && {
				variantAttributes:
					normalizedVariantAttributes.length > 0
						? normalizedVariantAttributes
						: Prisma.JsonNull
			})
		}

		if (
			dto.name ||
			dto.descriptionRu ||
			dto.categoryId !== undefined ||
			dto.searchKeywords !== undefined ||
			dto.priceUSD !== undefined ||
			dto.priceEUR !== undefined ||
			dto.priceUAH !== undefined
		) {
			let categoryName: string | null = product.category?.nameRu || null

			if (dto.categoryId) {
				const category = await this.prisma.category.findUnique({
					where: { id: dto.categoryId }
				})
				categoryName = category?.nameRu || null
			}

			updateData.searchKeywords = this.generateSearchKeywords(
				dto.name || product.name,
				dto.descriptionRu || product.descriptionRu,
				categoryName,
				dto.searchKeywords
			)
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

		return this.attachVariantPayload(updatedProduct, false)
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

		return { message: 'Товар успешно удален' }
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

	private normalizeVariantAttribute(attr: any): NormalizedVariantAttribute {
		return {
			key: attr.key.trim(),
			name: attr.name.trim(),
			value: attr.value.trim(),
			valueLabel: attr.valueLabel.trim(),
			displayType: attr.displayType ?? 'button',
			colorHex: attr.colorHex ?? null,
			sortOrder: Number(attr.sortOrder ?? 0)
		}
	}

	private parseVariantAttributes(
		value: Prisma.JsonValue | null | undefined
	): NormalizedVariantAttribute[] {
		if (!Array.isArray(value)) return []

		return value
			.map(item => {
				if (!item || typeof item !== 'object') return null

				const attr = item as Record<string, unknown>

				return {
					key: String(attr.key ?? '').trim(),
					name: String(attr.name ?? '').trim(),
					value: String(attr.value ?? '').trim(),
					valueLabel: String(attr.valueLabel ?? '').trim(),
					displayType: attr.displayType === 'color' ? 'color' : 'button',
					colorHex: typeof attr.colorHex === 'string' ? attr.colorHex : null,
					sortOrder: typeof attr.sortOrder === 'number' ? attr.sortOrder : 0
				}
			})
			.filter(
				(
					attr
				): attr is NormalizedVariantAttribute =>
					Boolean(attr?.key && attr?.name && attr?.value)
			)
	}

	private buildProductSlug(
		name: string,
		variantAttributes: NormalizedVariantAttribute[]
	) {
		const baseSlug = this.slugify(name)
		const seenSegments = new Set(
			baseSlug.split('-').filter(segment => segment.length > 0)
		)

		const attributeSegments: string[] = []

		for (const attribute of [...variantAttributes].sort(
			(a, b) =>
				(a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
				a.key.localeCompare(b.key)
		)) {
			for (const segment of this.slugify(attribute.value)
				.split('-')
				.filter(Boolean)) {
				if (!seenSegments.has(segment)) {
					seenSegments.add(segment)
					attributeSegments.push(segment)
				}
			}
		}

		return [baseSlug, ...attributeSegments].filter(Boolean).join('-') || 'product'
	}

	private slugify(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-zа-яё0-9\s-]/gi, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
	}

	private async ensureUniqueSlug(baseSlug: string, excludeId?: number) {
		const normalizedBaseSlug = baseSlug || 'product'
		let candidateSlug = normalizedBaseSlug
		let suffix = 2

		while (true) {
			const existingProduct = await this.prisma.product.findFirst({
				where: {
					slug: candidateSlug,
					...(excludeId ? { id: { not: excludeId } } : {})
				},
				select: { id: true }
			})

			if (!existingProduct) {
				return candidateSlug
			}

			candidateSlug = `${normalizedBaseSlug}-${suffix}`
			suffix += 1
		}
	}

	private async attachVariantPayload(
		product: any,
		onlyVisibleSiblings: boolean
	) {
		const currentAttributes = this.parseVariantAttributes(
			product.variantAttributes
		)

		if (!product.variantGroupKey) {
			return {
				...product,
				variantAttributes: currentAttributes,
				variantAxes: [],
				siblingVariants: []
			}
		}

		const siblings = await this.prisma.product.findMany({
			where: {
				variantGroupKey: product.variantGroupKey,
				...(onlyVisibleSiblings ? { isVisible: true } : {})
			},
			include: {
				productImages: {
					orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }]
				}
			},
			orderBy: [{ quantity: 'desc' }, { createdAt: 'asc' }]
		})

		const siblingVariants = siblings.map(variant => ({
			id: variant.id,
			name: variant.name,
			slug: variant.slug,
			quantity: variant.quantity,
			priceUSD: variant.priceUSD,
			priceEUR: variant.priceEUR,
			priceUAH: variant.priceUAH,
			productImages: variant.productImages,
			variantAttributes: this.parseVariantAttributes(variant.variantAttributes)
		}))

		const axisMap = new Map<
			string,
			{
				key: string
				name: string
				displayType: 'button' | 'color'
				values: Map<
					string,
					{
						value: string
						label: string
						colorHex: string | null
						sortOrder: number
					}
				>
			}
		>()

		for (const sibling of siblingVariants) {
			for (const attr of sibling.variantAttributes) {
				if (!axisMap.has(attr.key)) {
					axisMap.set(attr.key, {
						key: attr.key,
						name: attr.name,
						displayType: attr.displayType,
						values: new Map()
					})
				}

				const axis = axisMap.get(attr.key)!

				if (!axis.values.has(attr.value)) {
					axis.values.set(attr.value, {
						value: attr.value,
						label: attr.valueLabel,
						colorHex: attr.colorHex,
						sortOrder: attr.sortOrder ?? 0
					})
				}
			}
		}

		const variantAxes = Array.from(axisMap.values()).map(axis => ({
			key: axis.key,
			name: axis.name,
			displayType: axis.displayType,
			values: Array.from(axis.values.values()).sort(
				(a, b) =>
					(a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
					a.label.localeCompare(b.label)
			)
		}))

		return {
			...product,
			variantAttributes: currentAttributes,
			variantAxes,
			siblingVariants
		}
	}

	private groupPublicProducts<
		T extends {
			id: number
			name: string
			variantGroupKey?: string | null
		}
	>(
		products: T[]
	) {
		const seenGroupKeys = new Set<string>()

		return products.filter(product => {
			const groupKey = this.buildListingGroupKey(
				product.variantGroupKey,
				product.name,
				product.id
			)

			if (seenGroupKeys.has(groupKey)) {
				return false
			}

			seenGroupKeys.add(groupKey)
			return true
		})
	}

	private buildListingGroupKey(
		variantGroupKey: string | null | undefined,
		name: string,
		productId: number
	) {
		const baseGroupKey = variantGroupKey?.trim() || `product-${productId}`
		const normalizedName = this.slugify(name)

		return normalizedName ? `${baseGroupKey}::${normalizedName}` : baseGroupKey
	}
}
