import { Product } from '@entities/product'
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
			price: product.price,
			image: mainImage?.url || product.productImages?.[0]?.url
		})
	}, [product?.id, addProduct])
}
