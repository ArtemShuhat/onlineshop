'use client'

import { type Product } from '@entities/product'
import {
	useRecentlyViewedStore,
	useTrackProductView
} from '@features/recently-viewed'
import { RecentlyViewedProducts } from '@widgets/recently-viewed-products'
import { SimilarProducts } from '@widgets/similar-products'

interface ProductPageClientBitsProps {
	product: Product
}

export function ProductPageClientBits({ product }: ProductPageClientBitsProps) {
	useTrackProductView(product)

	const recentlyViewedProducts = useRecentlyViewedStore(state => state.products)
	const recentlyViewedIds = recentlyViewedProducts.map(item => item.id)

	return (
		<>
			<SimilarProducts productId={product.id} excludeIds={recentlyViewedIds} />
			<RecentlyViewedProducts excludeProductId={product.id} />
		</>
	)
}
