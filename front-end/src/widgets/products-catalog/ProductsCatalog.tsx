'use client'

import { type Product, type ProductSortBy } from '@entities/api/productsApi'
import { Skeleton } from '@shared/ui'
import { ProductCard } from '@widgets/productCard'

import { ProductSort } from '@/features/product-sort/ui/ProductSort'

interface ProductsCatalogProps {
	products: Product[]
	loading: boolean
	sortBy: ProductSortBy | undefined
	onSortChange: (sortBy: ProductSortBy | undefined) => void
}

export function ProductsCatalog({
	products,
	loading,
	sortBy,
	onSortChange
}: ProductsCatalogProps) {
	return (
		<section className='mx-auto max-w-[1280px] px-4 py-12 max-sm:px-3 max-sm:py-6'>
			<div className='mb-8 flex items-center justify-between max-sm:my-8 max-sm:items-start max-sm:gap-4'>
				<div className='flex items-baseline gap-3'>
					<h2 className='text-3xl font-bold text-gray-900 dark:text-white max-sm:text-xl max-md:text-2xl'>
						Каталог
					</h2>
					{loading ? (
						<Skeleton className='h-6 w-20 rounded-full max-xs:hidden' />
					) : (
						<p className='text-lg text-gray-500 dark:text-gray-400 max-xs:hidden max-sm:text-base'>
							{products.length} товаров
						</p>
					)}
				</div>
				<ProductSort value={sortBy} onChange={onSortChange} />
			</div>

			{loading ? (
				<div className='grid grid-cols-3 gap-8 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-2'>
					{[1, 2, 3, 4, 5, 6].map(i => (
						<div
							key={i}
							className='h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700'
						/>
					))}
				</div>
			) : products.length === 0 ? (
				<div className='py-20 text-center max-sm:py-10'>
					<p className='text-xl text-gray-500 dark:text-gray-400 max-sm:text-lg'>
						Товары пока не добавлены
					</p>
				</div>
			) : (
				<div className='grid grid-cols-3 gap-8 max-sm:grid-cols-1 max-sm:gap-4 max-lg:grid-cols-2'>
					{products.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</section>
	)
}
