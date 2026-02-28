'use client'

import { useRecentlyViewedStore } from '@features/recently-viewed/model/recentlyViewedStore'
import { ProductCard } from '@widgets/product-card'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface RecentlyViewedProductsProps {
	excludeProductId?: number
	excludeGroupKey?: string
	limit?: number
}

function buildRecentlyViewedListingKey(product: {
	name: string
	listingGroupKey?: string | null
}) {
	return (
		product.listingGroupKey?.trim() ||
		product.name
			.normalize('NFKC')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase()
	)
}

export function RecentlyViewedProducts({
	excludeProductId,
	excludeGroupKey,
	limit = 4
}: RecentlyViewedProductsProps) {
	const t = useTranslations('recentlyViewedProducts')
	const products = useRecentlyViewedStore(state => state.products)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const filteredProducts = Array.from(
		new Map(
			products
		.filter(p => p.id !== excludeProductId && p.quantity > 0)
		.filter(product => buildRecentlyViewedListingKey(product) !== excludeGroupKey)
				.map(product => [buildRecentlyViewedListingKey(product), product] as const)
		).values()
	)
		.slice(0, limit)

	if (filteredProducts.length === 0) return null

	return (
		<section className='mx-auto mt-10 max-w-[1280px] max-sm:px-3 max-sm:py-6'>
			<h2 className='my-7 text-3xl font-bold'>{t('title')}</h2>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{filteredProducts.map(product => (
					<ProductCard
						key={product.id}
						hideCartButton
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							priceUSD:
								typeof product.priceUSD === 'number' &&
								Number.isFinite(product.priceUSD)
									? product.priceUSD
									: typeof product.price === 'number' &&
											Number.isFinite(product.price)
										? product.price
										: 0,
							priceEUR:
								typeof product.priceEUR === 'number' &&
								Number.isFinite(product.priceEUR)
									? product.priceEUR
									: Number.NaN,
							priceUAH:
								typeof product.priceUAH === 'number' &&
								Number.isFinite(product.priceUAH)
									? product.priceUAH
									: Number.NaN,
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
							descriptionRu: '',
							descriptionEn: '',
							descriptionUk: '',
							createdAt: '',
							updatedAt: ''
						}}
					/>
				))}
			</div>
		</section>
	)
}
