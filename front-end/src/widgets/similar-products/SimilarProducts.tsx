'use client'

import { type Product, getSimilarProducts } from '@entities/product'
import { ProductCard } from '@widgets/product-card'
import { useEffect, useMemo, useState } from 'react'

interface SimilarProductsProps {
	productId: number
	excludeIds?: number[]
	limit?: number
}

export function SimilarProducts({
	productId,
	excludeIds = [],
	limit = 4
}: SimilarProductsProps) {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	const excludeIdsKey = useMemo(() => excludeIds.join(','), [excludeIds])

	useEffect(() => {
		async function fetchSimilar() {
			try {
				const idsToExclude = excludeIdsKey
					? excludeIdsKey.split(',').map(Number)
					: []
				const data = await getSimilarProducts(
					productId,
					limit + idsToExclude.length
				)
				const filtered = data
					.filter(p => !idsToExclude.includes(p.id))
					.slice(0, limit)
				setProducts(filtered)
			} catch (error) {
				console.error('Ошибка загрузки похожих товаров:', error)
				setProducts([])
			} finally {
				setLoading(false)
			}
		}

		fetchSimilar()
	}, [productId, limit, excludeIdsKey])

	if (loading) return null
	if (products.length === 0) return null

	return (
		<section className='mx-auto my-20 mt-10 max-w-[1280px] max-sm:px-3 max-sm:py-6'>
			<h2 className='my-7 text-3xl font-bold'>Вам также может понравиться</h2>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{products.map(product => (
					<ProductCard key={product.id} hideCartButton product={product} />
				))}
			</div>
		</section>
	)
}
