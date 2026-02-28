'use client'

import { type Product, getSimilarProducts } from '@entities/product'
import { ProductCard } from '@widgets/product-card'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

interface SimilarProductsProps {
	productId: number
	excludeGroupKey?: string
	excludeIds?: number[]
	limit?: number
}

function buildSimilarListingKey(product: Product) {
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

export function SimilarProducts({
	productId,
	excludeGroupKey,
	excludeIds = [],
	limit = 4
}: SimilarProductsProps) {
	const t = useTranslations('similarProducts')
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
				const filtered = Array.from(
					new Map(
						data
					.filter(p => !idsToExclude.includes(p.id))
					.filter(product => buildSimilarListingKey(product) !== excludeGroupKey)
							.map(product => [buildSimilarListingKey(product), product] as const)
					).values()
				)
					.slice(0, limit)
				setProducts(filtered)
			} catch (error) {
				console.error('Error loading similar products:', error)
				setProducts([])
			} finally {
				setLoading(false)
			}
		}

		fetchSimilar()
	}, [productId, limit, excludeIdsKey, excludeGroupKey])

	if (loading) return null
	if (products.length === 0) return null

	return (
		<section className='mx-auto my-20 mt-10 max-w-[1280px] max-sm:px-3 max-sm:py-6'>
			<h2 className='my-7 text-3xl font-bold'>{t('title')}</h2>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{products.map(product => (
					<ProductCard key={product.id} hideCartButton product={product} />
				))}
			</div>
		</section>
	)
}
