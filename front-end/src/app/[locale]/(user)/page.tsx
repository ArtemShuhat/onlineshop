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
import { getTranslations } from 'next-intl/server'

export const revalidate = 0

type Props = {
	searchParams: Promise<{ sortBy?: string }>
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

export default async function Page({ searchParams }: Props) {
	const t = await getTranslations('userPage')
	const { sortBy: sortByParam } = await searchParams
	const sortBy = parseSort(sortByParam)

	const [products, banners] = await Promise.all([
		getProducts({ sortBy }, { cache: 'no-store' }).catch(
			() => [] as Product[]
		),
		getBanners({ cache: 'no-store' }).catch(() => [] as Banner[])
	])

	return (
		<main className='min-w-full max-xs:pt-4 max-md:pt-8'>
			<BannerCarousel banners={banners} />

			<section className='mx-auto max-w-[1280px] px-4 py-12 max-sm:px-3 max-sm:py-6'>
				<div className='mb-8 flex items-center justify-between max-sm:my-8 max-sm:items-start max-sm:gap-4'>
					<div className='flex items-baseline gap-3'>
						<h2 className='text-3xl font-bold text-gray-900 dark:text-white max-sm:text-xl max-md:text-2xl'>
							{t('catalogTitle')}
						</h2>
						<p className='text-lg text-gray-500 dark:text-gray-400 max-xs:hidden max-sm:text-base'>
							{products.length} {getProductWord(products.length, t)}
						</p>
					</div>
					<QueryProductSort value={sortBy} />
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
			</section>

			<FeaturesSection />

			<div className='max-sm:hidden max-sm:py-6 max-md:pb-10'>
				<CurvedLoop
					marqueeText={t('brandMarquee')}
					speed={0.8}
					curveAmount={0}
					interactive={true}
					className='border-yellow-800 fill-black dark:fill-white'
				/>
			</div>
		</main>
	)
}
