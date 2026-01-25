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
		.filter(p => p.id !== excludeProductId)
		.slice(0, limit)

	if (filteredProducts.length === 0) return null

	return (
		<section className='mx-auto max-w-[1280px] px-4 max-sm:px-3 max-sm:py-6'>
			<h2 className='my-7 text-3xl font-bold'>Недавно просмотренные</h2>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{filteredProducts.map(product => (
					<ProductCard
						key={product.id}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							price: product.price,
							quantity: 1,
							isVisible: true,
							productImages: product.image
								? [{ id: 0, url: product.image, isMain: true, createdAt: '' }]
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
