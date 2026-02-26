import { type Product } from '@entities/product'
import { useEffect } from 'react'

import { useRecentlyViewedStore } from '../model/recentlyViewedStore'

export function useTrackProductView(product: Product | null) {
	const addProduct = useRecentlyViewedStore(state => state.addProduct)

	useEffect(() => {
		if (!product) return

		const mainImage = product.productImages?.find(img => img.isMain)

		addProduct({
			id: product.id,
			name: product.name,
			slug: product.slug,
			priceUSD: product.priceUSD,
			priceEUR: product.priceEUR,
			priceUAH: product.priceUAH,
			quantity: product.quantity,
			image: mainImage?.url || product.productImages?.[0]?.url
		})
	}, [product?.id, addProduct])
}
