import { type Banner, getBanners } from '@entities/banner'
import { type ProductSortBy, getProductsPage } from '@entities/product'
import { QueryProductSort } from '@features/product-sort'
import { cn } from '@shared/utils'
import { BrandCollage } from '@widgets/brand/BrandCollage'
import { BrandTicker } from '@widgets/brand/BrandTicker'
import { FeaturesSection } from '@widgets/features-section'
import { ProductCard } from '@widgets/product-card'
import { PromoMosaic } from '@widgets/promo-mosaic'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

function getPaginationItems(currentPage: number, totalPages: number) {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1)
	}

	if (currentPage <= 5) {
		return [1, 2, 3, 4, 5, 'ellipsis', totalPages] as const
	}

	if (currentPage >= totalPages - 4) {
		return [
			1,
			'ellipsis',
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages
		] as const
	}

	return [
		1,
		'ellipsis',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'ellipsis',
		totalPages
	] as const
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
					<div className='grid grid-cols-3 gap-8 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-2'>
						{products.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}

				{pagination.totalPages > 1 && (
					<nav
						className='mt-10 flex justify-center max-sm:mt-8'
						aria-label={t('pagination.pageOf', {
							page: pagination.page,
							total: pagination.totalPages
						})}
					>
						<div className='flex items-center gap-3 max-sm:gap-2'>
							{pagination.page === 1 ? (
								<span
									className='flex h-10 items-center justify-center px-1 text-gray-300 dark:text-gray-600'
									aria-hidden='true'
								>
									<ChevronLeft className='h-5 w-5' />
								</span>
							) : (
								<Link
									href={buildCatalogHref({
										page: pagination.page - 1,
										sortBy
									})}
									className='flex h-10 items-center justify-center px-1 text-gray-700 transition-colors hover:text-gray-950 focus-visible:text-purple-800 dark:text-gray-200 dark:hover:text-white'
									aria-label={t('pagination.previous')}
								>
									<ChevronLeft className='h-5 w-5' />
								</Link>
							)}

							<div className='flex items-center gap-5 max-sm:gap-3'>
								{getPaginationItems(pagination.page, pagination.totalPages).map(
									(item, index) =>
										item === 'ellipsis' ? (
											<span
												key={`ellipsis-${pagination.page}-${index}`}
												className='flex h-10 items-center justify-center text-base font-medium text-gray-500 dark:text-gray-400'
												aria-hidden='true'
											>
												...
											</span>
										) : (
											<Link
												key={item}
												href={buildCatalogHref({ page: item, sortBy })}
												aria-current={
													item === pagination.page ? 'page' : undefined
												}
												aria-label={t('pagination.pageOf', {
													page: item,
													total: pagination.totalPages
												})}
												className={cn(
													'flex h-10 items-center justify-center text-lg font-medium text-gray-700 transition-colors focus-visible:text-purple-800 dark:text-gray-200 max-sm:h-9 max-sm:text-base',
													item === pagination.page
														? 'text-purple-800'
														: 'hover:text-gray-950 dark:hover:text-white'
												)}
											>
												{item}
											</Link>
										)
								)}
							</div>

							{pagination.page === pagination.totalPages ? (
								<span
									className='flex h-10 items-center justify-center px-1 text-gray-300 dark:text-gray-600'
									aria-hidden='true'
								>
									<ChevronRight className='h-5 w-5' />
								</span>
							) : (
								<Link
									href={buildCatalogHref({
										page: pagination.page + 1,
										sortBy
									})}
									className='flex h-10 items-center justify-center px-1 text-gray-700 transition-colors hover:text-gray-950 focus-visible:text-purple-800 dark:text-gray-200 dark:hover:text-white'
									aria-label={t('pagination.next')}
								>
									<ChevronRight className='h-5 w-5' />
								</Link>
							)}
						</div>
					</nav>
				)}
			</section>

			<FeaturesSection />

			<BrandCollage />

			<BrandTicker />
		</main>
	)
}
