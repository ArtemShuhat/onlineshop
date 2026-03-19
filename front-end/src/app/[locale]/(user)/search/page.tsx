import {
	type Product,
	type ProductSortBy,
	type SearchResult,
	searchProducts
} from '@entities/product'
import { QueryProductSort } from '@features/product-sort'
import { ProductCard } from '@widgets/product-card'
import { Search as SearchIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const revalidate = 0

type Props = {
	searchParams: Promise<{
		q?: string
		sortBy?: string
	}>
}

function parseSort(value?: string): ProductSortBy | undefined {
	if (value === 'price_high' || value === 'price_low') return value
	return undefined
}

function toSafePrice(value: unknown): number | null {
	const num = Number(value)
	return Number.isFinite(num) ? num : null
}

function mapSearchHitToProduct(hit: SearchResult): Product {
	const legacyPrice = toSafePrice(hit.price)
	const priceUSD = toSafePrice(hit.priceUSD) ?? legacyPrice ?? 0
	const priceEUR = toSafePrice(hit.priceEUR)
	const priceUAH = toSafePrice(hit.priceUAH)

	return {
		id: hit.id,
		name: hit.name,
		slug: hit.slug,
		descriptionRu: hit.description,
		descriptionEn: hit.description,
		descriptionUk: hit.description,
		priceUSD,
		priceEUR: priceEUR ?? Number.NaN,
		priceUAH: priceUAH ?? Number.NaN,
		quantity: hit.quantity,
		isVisible: hit.isVisible,
		searchKeywords: hit.searchKeywords ?? [],
		categoryId: hit.categoryId ?? null,
		category: hit.categoryName
			? {
					id: hit.categoryId ?? 0,
					nameRu: hit.categoryName,
					nameEn: hit.categoryName,
					nameUk: hit.categoryName
				}
			: null,
		averageRating: 0,
		reviewCount: 0,
		productImages: hit.imageUrl
			? [
					{
						id: 0,
						url: hit.imageUrl,
						isMain: true,
						productId: hit.id,
						createdAt: ''
					}
				]
			: [],
		createdAt: '',
		updatedAt: ''
	}
}

export default async function SearchPage({ searchParams }: Props) {
	const t = await getTranslations('searchPage')
	const { q = '', sortBy: sortByParam } = await searchParams
	const query = q.trim()
	const sortBy = parseSort(sortByParam)

	let products: Product[] = []

	if (query.length >= 2) {
		try {
			const searchResponse = await searchProducts(
				{ q: query, sortBy },
				{ cache: 'no-store' }
			)
			products = searchResponse.hits.map(mapSearchHitToProduct)
		} catch {
			products = []
		}
	}

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='mb-20 flex-1'>
				{query.length < 2 ? (
					<div className='flex min-h-[calc(100vh-80px)] items-center justify-center py-20'>
						<div className='text-center'>
							<SearchIcon className='mx-auto h-16 w-16 text-gray-300' />
							<h2 className='mt-4 text-xl font-semibold text-gray-900'>
								{t('enterQueryTitle')}
							</h2>
						</div>
					</div>
				) : products.length === 0 ? (
					<div className='flex min-h-[calc(100vh-130px)] items-center justify-center'>
						<div className='text-center'>
							<SearchIcon className='mx-auto h-16 w-16 text-gray-300' />
							<h2 className='mt-4 text-xl font-semibold text-gray-900'>
								{t('nothingFoundTitle')}
							</h2>
						</div>
					</div>
				) : (
					<div className='mx-auto max-w-[1280px] px-4 py-8'>
						<div className='mb-6 flex items-center justify-between'>
							<div>
								<h1 className='mb-2 text-3xl font-bold text-gray-900 max-xs:text-xl'>
									{t('resultsTitle', { query })}
								</h1>
								<p className='text-gray-600 max-xs:text-[15px]'>
									{t('productsFound', { count: products.length })}
								</p>
							</div>
							<QueryProductSort value={sortBy} />
						</div>
						<div className='grid grid-cols-3 gap-8 max-xs:!grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-3'>
							{products.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	)
}
