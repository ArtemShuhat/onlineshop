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

function buildListingGroupKey(
	product: Pick<Product, 'name' | 'variantGroupKey' | 'variantAttributes'>
) {
	const colorAttribute = product.variantAttributes?.find(
		attr => attr.key.trim().toLowerCase() === 'color'
	)

	if (product.variantGroupKey?.trim() && colorAttribute?.value?.trim()) {
		return `${product.variantGroupKey.trim()}::${colorAttribute.value
			.normalize('NFKC')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase()}`
	}

	return product.name
		.normalize('NFKC')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase()
}

export function ProductPageClientBits({ product }: ProductPageClientBitsProps) {
	useTrackProductView(product)

	const recentlyViewedProducts = useRecentlyViewedStore(state => state.products)
	const recentlyViewedIds = recentlyViewedProducts.map(item => item.id)
	const currentListingGroupKey = buildListingGroupKey(product)

	return (
		<>
			<SimilarProducts
				productId={product.id}
				excludeIds={recentlyViewedIds}
				excludeGroupKey={currentListingGroupKey}
			/>
			<RecentlyViewedProducts
				excludeProductId={product.id}
				excludeGroupKey={currentListingGroupKey}
			/>
		</>
	)
}
