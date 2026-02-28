import { Injectable, Logger, OnModuleInit } from '@nestjs/common'

import {
	MeilisearchService,
	ProductDocument
} from '@/meilisearch/meilisearch.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SearchService implements OnModuleInit {
	private readonly logger = new Logger(SearchService.name)

	constructor(
		private readonly prisma: PrismaService,
		private readonly meilisearch: MeilisearchService
	) {}

	async onModuleInit() {
		await this.syncAllProducts()
	}

	async syncAllProducts() {
		const products = await this.prisma.product.findMany({
			include: {
				category: true,
				productImages: {
					where: { isMain: true },
					take: 1
				}
			}
		})

		const documents: ProductDocument[] = products.map(p => ({
			id: p.id,
			name: p.name,
			slug: p.slug,
			variantGroupKey: p.variantGroupKey,
			listingGroupKey: this.buildListingGroupKey(p.variantGroupKey, p.name, p.id),
			description: p.descriptionRu,

			price: p.priceUSD,
			priceUSD: p.priceUSD,
			priceEUR: p.priceEUR,
			priceUAH: p.priceUAH,

			quantity: p.quantity,
			categoryId: p.categoryId,
			categoryName: p.category?.nameRu || null,
			imageUrl: p.productImages[0]?.url || null,
			isVisible: p.isVisible,
			searchKeywords: p.searchKeywords
		}))

		await this.meilisearch.reindexAllProducts(documents)
		this.logger.log(`Synced ${documents.length} products to Meilisearch`)
	}

	async indexProduct(productId: number) {
		const product = await this.prisma.product.findUnique({
			where: { id: productId },
			include: {
				category: true,
				productImages: {
					where: { isMain: true },
					take: 1
				}
			}
		})

		if (!product) return

		const document: ProductDocument = {
			id: product.id,
			name: product.name,
			slug: product.slug,
			variantGroupKey: product.variantGroupKey,
			listingGroupKey: this.buildListingGroupKey(
				product.variantGroupKey,
				product.name,
				product.id
			),
			description: product.descriptionRu,

			price: product.priceUSD,
			priceUSD: product.priceUSD,
			priceEUR: product.priceEUR,
			priceUAH: product.priceUAH,

			quantity: product.quantity,
			categoryId: product.categoryId,
			categoryName: product.category?.nameRu || null,
			imageUrl: product.productImages[0]?.url || null,
			isVisible: product.isVisible,
			searchKeywords: product.searchKeywords
		}

		await this.meilisearch.indexProducts([document])
	}

	async removeProduct(productId: number) {
		await this.meilisearch.deleteProduct(productId)
	}

	async search(
		query: string,
		options?: {
			categoryId?: number
			minPrice?: number
			maxPrice?: number
			sortBy?: 'price_high' | 'price_low'
			limit?: number
		}
	) {
		const filters: string[] = ['isVisible = true', 'quantity > 0']

		if (options?.maxPrice) {
			filters.push(`price <= ${options.maxPrice}`)
		}

		if (options?.minPrice) {
			filters.push(`price >= ${options.minPrice}`)
		}

		let sort: string[] | undefined
		if (options?.sortBy === 'price_high') {
			sort = ['price:desc']
		} else if (options?.sortBy === 'price_low') {
			sort = ['price:asc']
		}

		const requestedLimit = options?.limit || 50
		const fetchLimit = Math.max(requestedLimit * 5, 200)

		const results = await this.meilisearch.searchProducts(query, {
			filter: filters.join(' AND '),
			sort,
			limit: fetchLimit
		})

		const groupedHits = this.groupSearchHits(results.hits).slice(0, requestedLimit)

		return {
			hits: groupedHits,
			totalHits: groupedHits.length,
			query: results.query,
			processgTimeMs: results.processingTimeMs
		}
	}

	private groupSearchHits(hits: ProductDocument[]) {
		const seenGroupKeys = new Set<string>()

		return hits.filter(hit => {
			const groupKey = hit.listingGroupKey

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

	private slugify(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-zа-яё0-9\s-]/gi, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
	}
}
