'use client';

import { getProductBySlug } from '@entities/product';
import { ProductInfo, ProductTabs } from '@features/product-details'
import { useRecentlyViewedStore, useTrackProductView } from '@features/recently-viewed';
import { getProductImages } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';
import { ProductGallery } from '@widgets/product-gallery';
import { RecentlyViewedProducts } from '@widgets/recently-viewed-products';
import { SimilarProducts } from '@widgets/similar-products';
import { useParams } from 'next/navigation';





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
				<div className='container mx-auto max-w-7xl p-6'>
					<div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
						<div className='h-[500px] animate-pulse rounded-lg bg-gray-200' />
						<div className='space-y-4'>
							<div className='h-8 animate-pulse rounded bg-gray-200' />
							<div className='h-6 w-1/2 animate-pulse rounded bg-gray-200' />
							<div className='h-4 w-3/4 animate-pulse rounded bg-gray-200' />
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