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
			description: p.description,

			price: p.priceUSD,
			priceUSD: p.priceUSD,
			priceEUR: p.priceEUR,
			priceUAH: p.priceUAH,

			quantity: p.quantity,
			categoryId: p.categoryId,
			categoryName: p.category?.name || null,
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
			description: product.description,

			price: product.priceUSD,
			priceUSD: product.priceUSD,
			priceEUR: product.priceEUR,
			priceUAH: product.priceUAH,

			quantity: product.quantity,
			categoryId: product.categoryId,
			categoryName: product.category?.name || null,
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

		const results = await this.meilisearch.searchProducts(query, {
			filter: filters.join(' AND '),
			sort,
			limit: options?.limit || 50
		})

		return {
			hits: results.hits,
			totalHits: results.totalHits,
			query: results.query,
			processgTimeMs: results.processingTimeMs
		}
	}
}
