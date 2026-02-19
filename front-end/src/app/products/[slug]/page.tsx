'use client'

import { getProductBySlug } from '@entities/product'
import { ProductInfo, ProductTabs } from '@features/product-details'
import {
	useRecentlyViewedStore,
	useTrackProductView
} from '@features/recently-viewed'
import { getProductImages } from '@shared/lib'
import { Skeleton } from '@shared/ui'
import { useQuery } from '@tanstack/react-query'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { ProductGallery } from '@widgets/product-gallery'
import { RecentlyViewedProducts } from '@widgets/recently-viewed-products'
import { SimilarProducts } from '@widgets/similar-products'
import { useParams } from 'next/navigation'

export default function ProductPage() {
	const params = useParams()
	const recentlyViewedProducts = useRecentlyViewedStore(state => state.products)
	const recentlyViewedIds = recentlyViewedProducts.map(p => p.id)

	const {
		data: product,
		isLoading,
		error
	} = useQuery({
		queryKey: ['product', params.slug],
		queryFn: () => getProductBySlug(params.slug as string)
	})
	useTrackProductView(product ?? null)

	if (isLoading) {
		return (
			<>
				<Header />
				<div className='container mb-20 max-w-7xl p-6'>
					<nav className='mb-6 flex items-center gap-2'>
						<Skeleton className='h-4 w-14 rounded' />
						<Skeleton className='h-4 w-3 rounded' />
						<Skeleton className='h-4 w-14 rounded' />
						<Skeleton className='h-4 w-3 rounded' />
						<Skeleton className='h-4 w-36 rounded' />
					</nav>

					<div className='mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2'>
						<div className='space-y-4'>
							<Skeleton className='aspect-square w-full rounded-lg max-md:aspect-auto max-md:h-[450px]' />
							<div className='grid grid-cols-5 gap-3 max-md:grid-cols-6 max-md:gap-2'>
								<Skeleton className='aspect-square rounded-lg' />
								<Skeleton className='aspect-square rounded-lg' />
								<Skeleton className='aspect-square rounded-lg' />
								<Skeleton className='aspect-square rounded-lg' />
								<Skeleton className='aspect-square rounded-lg' />
							</div>
						</div>
						<div className='space-y-6'>
							<div className='space-y-3'>
								<Skeleton className='h-10 w-4/5 rounded' />
								<Skeleton className='h-5 w-1/3 rounded' />
							</div>
							<div className='flex items-center gap-3'>
								<Skeleton className='h-4 w-28 rounded' />
								<Skeleton className='h-4 w-32 rounded' />
								<Skeleton className='h-4 w-24 rounded' />
							</div>
							<Skeleton className='h-10 w-32 rounded' />
							<Skeleton className='h-8 w-32 rounded-full' />
							<div className='space-y-4 pt-2'>
								<div className='space-y-2'>
									<Skeleton className='h-4 w-24 rounded' />
									<Skeleton className='h-12 w-40 rounded-lg' />
								</div>
								<div className='space-y-3'>
									<Skeleton className='h-12 w-full rounded-lg' />
									<Skeleton className='h-12 w-full rounded-lg' />
								</div>
								<div className='space-y-2.5 pt-4'>
									<Skeleton className='h-4 w-56 rounded' />
									<Skeleton className='h-4 w-52 rounded' />
									<Skeleton className='h-4 w-48 rounded' />
								</div>
							</div>
						</div>
					</div>

					<div className='mt-12'>
						<div className='overflow-hidden rounded-t-2xl border bg-white shadow-sm'>
							<div className='flex'>
								<Skeleton className='h-[57px] flex-1 rounded-none' />
								<Skeleton className='h-[57px] flex-1 rounded-none' />
								<Skeleton className='h-[57px] flex-1 rounded-none' />
							</div>
						</div>
						<div className='space-y-6 rounded-b-2xl border border-t-0 bg-white p-8 shadow-sm'>
							<div className='flex items-center gap-3'>
								<Skeleton className='h-10 w-10 rounded-lg' />
								<Skeleton className='h-8 w-64 rounded' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-full rounded' />
								<Skeleton className='h-5 w-[92%] rounded' />
								<Skeleton className='h-5 w-5/6 rounded' />
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								<Skeleton className='h-24 w-full rounded-xl' />
								<Skeleton className='h-24 w-full rounded-xl' />
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	if (error || !product) {
		return (
			<>
				<Header />
				<div className='container mx-auto max-w-7xl p-6 py-20 text-center'>
					<h1 className='text-2xl font-bold text-gray-900'>Товар не найден</h1>
					<p className='mt-2 text-gray-600'>
						К сожалению, запрашиваемый товар не найден
					</p>
				</div>
			</>
		)
	}

	return (
		<>
			<Header />

			<div className='container mb-20 max-w-7xl p-6'>
				<nav className='mb-6 text-sm text-gray-500'>
					<a href='/' className='hover:text-gray-900'>
						Главная
					</a>
					<span className='mx-2'>&gt;</span>
					<a href='/' className='hover:text-gray-900'>
						Товары
					</a>
					<span className='mx-2'>&gt;</span>
					<span className='text-gray-900'>{product.name}</span>
				</nav>

				<div className='mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2'>
					<ProductGallery images={getProductImages(product.productImages)} />
					<ProductInfo product={product} />
				</div>

				<ProductTabs product={product} />

				<SimilarProducts
					productId={product.id}
					excludeIds={recentlyViewedIds}
				/>

				<RecentlyViewedProducts excludeProductId={product?.id} />
			</div>

			<Footer />
		</>
	)
}
