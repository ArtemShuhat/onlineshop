'use client'

import { type Product, getSimilarProducts } from '@entities/product'
import { ProductCard } from '@widgets/product-card'
import { useEffect, useState } from 'react'

interface SimilarProductsProps {
	productId: number
	limit?: number
}

export function SimilarProducts({
	productId,
	limit = 4
}: SimilarProductsProps) {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchSimilar() {
			try {
				const data = await getSimilarProducts(productId, limit)
				setProducts(data)
			} catch (error) {
				console.error('Ошибка загрузки похожих товаров:', error)
				setProducts([])
			} finally {
				setLoading(false)
			}
		}

		fetchSimilar()
	}, [productId, limit])

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
