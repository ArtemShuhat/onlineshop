import { type Product } from '@entities/product'
import { useEffect } from 'react'

import { useRecentlyViewedStore } from '../model/recentlyViewedStore'

function buildProductListingGroupKey(product: Product) {
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

export function useTrackProductView(product: Product | null) {
	const addProduct = useRecentlyViewedStore(state => state.addProduct)

	useEffect(() => {
		if (!product) return

		const mainImage = product.productImages?.find(img => img.isMain)

		addProduct({
			id: product.id,
			name: product.name,
			slug: product.slug,
			variantGroupKey: product.variantGroupKey ?? null,
			listingGroupKey: buildProductListingGroupKey(product),
			priceUSD: product.priceUSD,
			priceEUR: product.priceEUR,
			priceUAH: product.priceUAH,
			quantity: product.quantity,
			image: mainImage?.url || product.productImages?.[0]?.url
		})
	}, [product?.id, addProduct])
}
