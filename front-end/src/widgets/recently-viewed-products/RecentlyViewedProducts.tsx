'use client'

import { useRecentlyViewedStore } from '@features/recently-viewed/model/recentlyViewedStore'
import { ProductCard } from '@widgets/product-card'
import { useEffect, useState } from 'react'

interface RecentlyViewedProductsProps {
	excludeProductId?: number
	limit?: number
}

export function RecentlyViewedProducts({
	excludeProductId,
	limit = 4
}: RecentlyViewedProductsProps) {
	const products = useRecentlyViewedStore(state => state.products)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const filteredProducts = products
		.filter(p => p.id !== excludeProductId && p.quantity > 0)
		.slice(0, limit)

	if (filteredProducts.length === 0) return null

	return (
		<section className='mx-auto mt-10 max-w-[1280px] max-sm:px-3 max-sm:py-6'>
			<h2 className='my-7 text-3xl font-bold'>Недавно просмотренные</h2>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{filteredProducts.map(product => (
					<ProductCard
						key={product.id}
						hideCartButton
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							priceUSD: product.price,
							priceEUR: 0,
							priceUAH: 0,
							quantity: product.quantity,
							isVisible: true,
							searchKeywords: [],
							categoryId: null,
							category: null,
							averageRating: 0,
							reviewCount: 0,
							productImages: product.image
								? [
										{
											id: 0,
											url: product.image,
											isMain: true,
											productId: product.id,
											createdAt: ''
										}
									]
								: [],
							description: '',
							createdAt: '',
							updatedAt: ''
						}}
					/>
				))}
			</div>
		</section>
	)
}
