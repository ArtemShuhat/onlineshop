import { type Banner, getBanners } from '@entities/banner'
import {
	type Product,
	type ProductSortBy,
	getProducts
} from '@entities/product'
import { QueryProductSort } from '@features/product-sort'
import CurvedLoop from '@shared/components/CurvedLoop'
import { BannerCarousel } from '@widgets/banner-carousel'
import { FeaturesSection } from '@widgets/features-section'
import { ProductCard } from '@widgets/product-card'

export const revalidate = 120

type Props = {
	searchParams: Promise<{ sortBy?: string }>
}

function parseSort(value?: string): ProductSortBy | undefined {
	if (value === 'price_high' || value === 'price_low') {
		return value
	}
	return undefined
}

function getProductWord(count: number) {
	const n = Math.abs(count) % 100
	const n1 = n % 10

	if (n > 10 && n < 20) return 'товаров'
	if (n1 > 1 && n1 < 5) return 'товара'
	if (n1 === 1) return 'товар'
	return 'товаров'
}

export default async function Page({ searchParams }: Props) {
	const { sortBy: sortByParam } = await searchParams
	const sortBy = parseSort(sortByParam)

	const [products, banners] = await Promise.all([
		getProducts({ sortBy }, { next: { revalidate: 120 } }).catch(
			() => [] as Product[]
		),
		getBanners({ next: { revalidate: 120 } }).catch(() => [] as Banner[])
	])

	return (
		<main className='min-w-full max-xs:pt-4 max-md:pt-8'>
			<BannerCarousel banners={banners} />

			<section className='mx-auto max-w-[1280px] px-4 py-12 max-sm:px-3 max-sm:py-6'>
				<div className='mb-8 flex items-center justify-between max-sm:my-8 max-sm:items-start max-sm:gap-4'>
					<div className='flex items-baseline gap-3'>
						<h2 className='text-3xl font-bold text-gray-900 dark:text-white max-sm:text-xl max-md:text-2xl'>
							Каталог
						</h2>
						<p className='text-lg text-gray-500 dark:text-gray-400 max-xs:hidden max-sm:text-base'>
							{products.length} {getProductWord(products.length)}
						</p>
					</div>
					<QueryProductSort value={sortBy} />
				</div>

				{products.length === 0 ? (
					<div className='py-20 text-center max-sm:py-10'>
						<p className='text-xl text-gray-500 dark:text-gray-400 max-sm:text-lg'>
							Каталог товаров пуст
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

			<FeaturesSection />

			<div className='max-sm:hidden max-sm:py-6 max-md:pb-10'>
				<CurvedLoop
					marqueeText='Apple | Razer | Fifine | Samsung | Logitech |'
					speed={0.8}
					curveAmount={0}
					interactive={true}
					className='border-yellow-800 fill-black dark:fill-white'
				/>
			</div>
		</main>
	)
}
