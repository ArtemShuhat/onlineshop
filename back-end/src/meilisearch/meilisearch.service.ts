import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Index, MeiliSearch } from 'meilisearch'

export interface ProductDocument {
	id: number
	name: string
	slug: string
	description: string
	price: number
	priceUSD: number
	priceEUR: number | null
	priceUAH: number | null
	quantity: number
	categoryId: number | null
	categoryName: string | null
	imageUrl: string | null
	isVisible: boolean
	searchKeywords: string[]
}

@Injectable()
export class MeilisearchService implements OnModuleInit {
	private client: MeiliSearch
	private readonly logger = new Logger(MeilisearchService.name)

	readonly PRODUCTS_INDEX = 'products'

	constructor() {
		this.client = new MeiliSearch({
			host: process.env.MEILISEARCH_HOST,
			apiKey: process.env.MEILISEARCH_API_KEY
		})
	}

	async onModuleInit() {
		await this.setupProductsIndex()
	}

	private async setupProductsIndex() {
		try {
			const index = this.client.index(this.PRODUCTS_INDEX)

			await index.updateSearchableAttributes([
				'name',
				'description',
				'searchKeywords',
				'categoryName'
			])

			await index.updateFilterableAttributes([
				'categoryId',
				'price',
				'priceUSD',
				'priceEUR',
				'priceUAH',
				'isVisible',
				'quantity'
			])

			await index.updateSortableAttributes(['price', 'priceUSD', 'quantity'])

			await index.updateTypoTolerance({
				enabled: true,
				minWordSizeForTypos: {
					oneTypo: 4,
					twoTypos: 8
				}
			})

			this.logger.log('Индекс товаров Meilisearch настроен')
		} catch (error) {
			this.logger.error('Не удалось настроить индекс Meilisearch', error)
		}
	}

	getIndex(indexName: string): Index {
		return this.client.index(indexName)
	}

	async indexProducts(products: ProductDocument[]) {
		const index = this.client.index(this.PRODUCTS_INDEX)
		await index.addDocuments(products, { primaryKey: 'id' })
	}

	async deleteProduct(productId: number) {
		const index = this.client.index(this.PRODUCTS_INDEX)
		await index.deleteDocument(productId)
	}

	async searchProducts(
		query: string,
		options?: {
			filter?: string
			sort?: string[]
			limit?: number
			offset?: number
		}
	) {
		const index = this.client.index(this.PRODUCTS_INDEX)

		const searchOptions: any = {
			limit: options?.limit || 50,
			offset: options?.offset || 0,
			attributesToHighlight: ['name', 'description']
		}

		if (options?.filter) {
			searchOptions.filter = options.filter
		}

		if (options?.sort) {
			searchOptions.sort = options.sort
		}

		return index.search(query, searchOptions)
	}

	async reindexAllProducts(products: ProductDocument[]) {
		const index = this.client.index(this.PRODUCTS_INDEX)
		await index.deleteAllDocuments()
		await index.addDocuments(products, { primaryKey: 'id' })
		this.logger.log(`Переиндексированно ${products.length} продуктов`)
	}
}
