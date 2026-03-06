import { type Banner, getBanners } from '@entities/banner'
import { type ProductSortBy, getProductsPage } from '@entities/product'
import { QueryProductSort } from '@features/product-sort'
import { BrandCollage } from '@widgets/brand/BrandCollage'
import { BrandTicker } from '@widgets/brand/BrandTicker'
import { CatalogPagination } from '@widgets/catalog-pagination'
import { FeaturesSection } from '@widgets/features-section'
import { ProductCard } from '@widgets/product-card'
import { PromoMosaic } from '@widgets/promo-mosaic'
import { getTranslations } from 'next-intl/server'

export const revalidate = 0

type Props = {
	searchParams: Promise<{ page?: string; sortBy?: string }>
}

function parseSort(value?: string): ProductSortBy | undefined {
	if (value === 'price_high' || value === 'price_low') {
		return value
	}
	return undefined
}

function getProductWord(
	count: number,
	t: Awaited<ReturnType<typeof getTranslations>>
) {
	const n = Math.abs(count) % 100
	const n1 = n % 10

	if (n > 10 && n < 20) return t('productWord.many')
	if (n1 > 1 && n1 < 5) return t('productWord.few')
	if (n1 === 1) return t('productWord.one')
	return t('productWord.many')
}

function parsePage(value?: string) {
	const page = Number(value)

	return Number.isInteger(page) && page > 0 ? page : 1
}

export default async function Page({ searchParams }: Props) {
	const t = await getTranslations('userPage')
	const { page: pageParam, sortBy: sortByParam } = await searchParams
	const page = parsePage(pageParam)
	const sortBy = parseSort(sortByParam)
	const pageSize = 9

	const [productsResponse, banners] = await Promise.all([
		getProductsPage(
			{ page, limit: pageSize, sortBy },
			{ cache: 'no-store' }
		).catch(() => ({
			items: [],
			pagination: {
				total: 0,
				page,
				limit: pageSize,
				totalPages: 0
			}
		})),
		getBanners({ cache: 'no-store' }).catch(() => [] as Banner[])
	])

	const products = productsResponse.items
	const { pagination } = productsResponse

	return (
		<main className='min-w-full '>
			<PromoMosaic banners={banners} />

			<section
				id='catalog'
				className='mx-auto max-w-[1280px] px-4 py-12 max-sm:px-3 max-sm:py-6'
			>
				<div className='mb-8 flex items-center justify-between max-sm:my-8 max-sm:items-start max-sm:gap-4'>
					<div className='flex items-baseline gap-3'>
						<h2 className='text-3xl font-bold text-gray-900 dark:text-white max-sm:text-xl max-md:text-2xl'>
							{t('catalogTitle')}
						</h2>
						<p className='text-lg text-gray-500 dark:text-gray-400 max-xs:hidden max-sm:text-base'>
							{pagination.total} {getProductWord(pagination.total, t)}
						</p>
					</div>
					<QueryProductSort value={sortBy} resetPageOnChange />
				</div>

				{products.length === 0 ? (
					<div className='py-20 text-center max-sm:py-10'>
						<p className='text-xl text-gray-500 dark:text-gray-400 max-sm:text-lg'>
							{t('emptyCatalog')}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-3 gap-8 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-3 max-xs:!grid-cols-2'>
						{products.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}

				<CatalogPagination
					page={pagination.page}
					totalPages={pagination.totalPages}
					sortBy={sortBy}
				/>
			</section>

			<FeaturesSection />
			<BrandCollage />
			<BrandTicker />
		</main>
	)
}
