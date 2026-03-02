import { type Banner, getBanners } from '@entities/banner'
import { type ProductSortBy, getProductsPage } from '@entities/product'
import { QueryProductSort } from '@features/product-sort'
import { Button } from '@shared/ui'
import { BannerCarousel } from '@widgets/banner-carousel'
import { BrandCollage } from '@widgets/brand/BrandCollage'
import { BrandTicker } from '@widgets/brand/BrandTicker'
import { FeaturesSection } from '@widgets/features-section'
import { ProductCard } from '@widgets/product-card'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

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

function buildCatalogHref({
	page,
	sortBy
}: {
	page: number
	sortBy?: ProductSortBy
}) {
	const queryParams = new URLSearchParams()

	if (page > 1) queryParams.set('page', String(page))
	if (sortBy) queryParams.set('sortBy', sortBy)

	const query = queryParams.toString()
	return query ? `?${query}#catalog` : '?#catalog'
}

function getVisiblePages(currentPage: number, totalPages: number) {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => index + 1)
	}

	const pages = new Set([
		1,
		totalPages,
		currentPage - 1,
		currentPage,
		currentPage + 1
	])

	return Array.from(pages)
		.filter(page => page >= 1 && page <= totalPages)
		.sort((a, b) => a - b)
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
		<main className='min-w-full max-xs:pt-4 max-md:pt-8'>
			<BannerCarousel banners={banners} />

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
					<div className='grid grid-cols-3 gap-8 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-2'>
						{products.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}

				{pagination.totalPages > 1 && (
					<div className='mt-10 flex flex-col items-center gap-4 max-sm:mt-8'>
						<div className='flex items-center gap-2'>
							{pagination.page === 1 ? (
								<Button variant='outline' disabled>
									{t('pagination.previous')}
								</Button>
							) : (
								<Button asChild variant='outline'>
									<Link
										href={buildCatalogHref({
											page: pagination.page - 1,
											sortBy
										})}
									>
										{t('pagination.previous')}
									</Link>
								</Button>
							)}

							<div className='flex items-center gap-2'>
								{getVisiblePages(pagination.page, pagination.totalPages).map(
									pageNumber => (
										<Button
											key={pageNumber}
											asChild
											variant={
												pageNumber === pagination.page ? 'default' : 'outline'
											}
											size='icon'
										>
											<Link
												href={buildCatalogHref({ page: pageNumber, sortBy })}
												aria-current={
													pageNumber === pagination.page ? 'page' : undefined
												}
											>
												{pageNumber}
											</Link>
										</Button>
									)
								)}
							</div>

							{pagination.page === pagination.totalPages ? (
								<Button variant='outline' disabled>
									{t('pagination.next')}
								</Button>
							) : (
								<Button asChild variant='outline'>
									<Link
										href={buildCatalogHref({
											page: pagination.page + 1,
											sortBy
										})}
									>
										{t('pagination.next')}
									</Link>
								</Button>
							)}
						</div>
					</div>
				)}
			</section>

			<FeaturesSection />

			<BrandCollage />

			<BrandTicker />
		</main>
	)
}
