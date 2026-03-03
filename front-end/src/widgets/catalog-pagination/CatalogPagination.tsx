import { type ProductSortBy } from '@entities/product'
import { cn } from '@shared/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

type Props = {
	page: number
	totalPages: number
	sortBy?: ProductSortBy
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

export async function CatalogPagination({ page, totalPages, sortBy }: Props) {
	const t = await getTranslations('userPage')

	if (totalPages <= 1) {
		return null
	}

	return (
		<nav
			className='mt-10 flex justify-center max-sm:mt-8'
			aria-label={t('pagination.pageOf', {
				page,
				total: totalPages
			})}
		>
			<div className='flex items-center gap-3 max-sm:gap-2'>
				{page === 1 ? (
					<span
						className='flex h-10 items-center justify-center px-1 text-gray-300 dark:text-gray-600'
						aria-hidden='true'
					>
						<ChevronLeft className='h-5 w-5' />
					</span>
				) : (
					<Link
						href={buildCatalogHref({
							page: page - 1,
							sortBy
						})}
						className='flex h-10 items-center justify-center px-1 text-gray-700 transition-colors hover:text-gray-950 focus-visible:text-purple-800 dark:text-gray-200 dark:hover:text-white'
						aria-label={t('pagination.previous')}
					>
						<ChevronLeft className='h-5 w-5' />
					</Link>
				)}

				<div className='flex items-center gap-5 max-sm:gap-3'>
					{getPaginationItems(page, totalPages).map((item, index) =>
						item === 'ellipsis' ? (
							<span
								key={`ellipsis-${page}-${index}`}
								className='flex h-10 items-center justify-center text-base font-medium text-gray-500 dark:text-gray-400'
								aria-hidden='true'
							>
								...
							</span>
						) : (
							<Link
								key={item}
								href={buildCatalogHref({ page: item, sortBy })}
								aria-current={item === page ? 'page' : undefined}
								aria-label={t('pagination.pageOf', {
									page: item,
									total: totalPages
								})}
								className={cn(
									'flex h-10 items-center justify-center text-lg font-medium text-gray-700 transition-colors focus-visible:text-purple-800 dark:text-gray-200 max-sm:h-9 max-sm:text-base',
									item === page
										? 'text-purple-800'
										: 'hover:text-gray-950 dark:hover:text-white'
								)}
							>
								{item}
							</Link>
						)
					)}
				</div>

				{page === totalPages ? (
					<span
						className='flex h-10 items-center justify-center px-1 text-gray-300 dark:text-gray-600'
						aria-hidden='true'
					>
						<ChevronRight className='h-5 w-5' />
					</span>
				) : (
					<Link
						href={buildCatalogHref({
							page: page + 1,
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
	)
}
