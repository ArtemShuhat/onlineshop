'use client'

import { PriceTag } from '@entities/currency'
import type { Product } from '@entities/product'
import { useProfile } from '@entities/user'
import { useAddToCart } from '@features/add-to-cart'
import { useFavoritesStore } from '@features/favorites'
import { ProductVariantPicker } from '@features/product-details'
import { Button } from '@shared/ui'
import {
	Check,
	Heart,
	Minus,
	Plus,
	RotateCcw,
	Shield,
	ShoppingCart,
	Star,
	Tag,
	Truck
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductInfoProps {
	product: Product
}

function getReviewWord(count: number, t: (key: string) => string) {
	const n = Math.abs(count) % 100
	const n1 = n % 10

	if (n > 10 && n < 20) return t('reviewWord.many')
	if (n1 > 1 && n1 < 5) return t('reviewWord.few')
	if (n1 === 1) return t('reviewWord.one')
	return t('reviewWord.many')
}

export function ProductInfo({ product }: ProductInfoProps) {
	const t = useTranslations('productInfo')
	const [quantity, setQuantity] = useState(1)
	const router = useRouter()

	const { addToCart, isLoading } = useAddToCart()
	const { toggle, isFavorite } = useFavoritesStore()
	const isInFavorites = isFavorite(product.id)
	const locale = useLocale()

	const { user } = useProfile()

	const isOutOfStock = product.quantity === 0
	const isLowStock = product.quantity > 0 && product.quantity <= 10
	const maxQuantity = product.quantity

	const handleAddToCartAndGo = () => {
		addToCart(product, quantity)
		setTimeout(() => {
			router.push('/cart')
		}, 0)
	}

	const handleToggleFavorite = () => {
		toggle({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.priceUSD,
			image: product.productImages?.[0]?.url
		})
	}

	const handleRewiewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!user) {
			e.preventDefault()
			toast.error(t('loginToReview'))
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold leading-tight text-gray-900'>
					{product.name}
				</h1>
				{product.category && (
					<p className='mt-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500'>
						<Tag className='h-3.5 w-3.5' />
						{locale === 'en'
							? product.category.nameEn
							: locale === 'uk'
								? product.category.nameUk
								: product.category.nameRu}
					</p>
				)}
			</div>
			<div className='flex items-center gap-3'>
				<div className='flex items-center gap-0.5'>
					{[1, 2, 3, 4, 5].map(star => (
						<Star
							key={star}
							className={`h-4 w-4 ${
								star <= Math.round(product.averageRating || 0)
									? 'fill-yellow-400 text-yellow-400'
									: 'fill-gray-300 text-gray-300'
							}`}
						/>
					))}
				</div>
				<span className='text-sm text-gray-500'>
					{product.averageRating > 0
						? `${product.averageRating.toFixed(1)} (${product.reviewCount} ${getReviewWord(
								product.reviewCount,
								t
							)})`
						: t('noReviews')}
				</span>
				<a
					href='#reviews'
					className='text-sm font-medium text-pur hover:underline'
					onClick={handleRewiewClick}
				>
					{t('addReview')}
				</a>
			</div>
			<div className='flex gap-6'>
				<PriceTag
					priceUSD={product.priceUSD}
					priceEUR={product.priceEUR}
					priceUAH={product.priceUAH}
					className='text-4xl font-bold text-gray-900'
				/>
				{isOutOfStock ? (
					<div className='inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5'>
						<span className='h-2 w-2 rounded-full bg-red-500' />
						<span className='text-sm font-semibold text-red-700'>
							{t('outOfStock')}
						</span>
					</div>
				) : isLowStock ? (
					<div className='inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5'>
						<span className='h-2 w-2 rounded-full bg-orange-500' />
						<span className='text-sm font-semibold text-orange-700'>
							{t('leftCount', { count: product.quantity })}
						</span>
					</div>
				) : (
					<div className='inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5'>
						<Check className='h-3.5 w-3.5 text-green-600' />
						<span className='text-sm font-semibold text-green-700'>
							{t('inStock')}
						</span>
					</div>
				)}
			</div>

			{!isOutOfStock && (
				<div className='space-y-4 pt-2'>
					<ProductVariantPicker product={product} />

					<div>
						<label className='mb-2 block text-sm font-semibold text-gray-700'>
							{t('quantity')}
						</label>
						<div className='inline-flex items-center gap-2 rounded-lg border bg-white p-1'>
							<button
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								disabled={quantity <= 1}
								className='flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40'
							>
								<Minus className='h-4 w-4' />
							</button>

							<span className='w-12 text-center text-lg font-bold'>
								{quantity}
							</span>

							<button
								onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
								disabled={quantity >= maxQuantity}
								className='flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40'
							>
								<Plus className='h-4 w-4' />
							</button>
						</div>
					</div>
					<div className='space-y-3'>
						<Button
							onClick={handleAddToCartAndGo}
							disabled={isLoading}
							className='h-12 w-full rounded-lg bg-pur text-base font-semibold text-white transition hover:bg-purh'
						>
							{isLoading ? (
								<>
									<div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
									{t('adding')}
								</>
							) : (
								<>
									<ShoppingCart className='mr-2 h-5 w-5' />
									{t('addToCart')}
								</>
							)}
						</Button>

						<button
							onClick={handleToggleFavorite}
							className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 font-semibold transition ${
								isInFavorites
									? 'hover:bg-gray-50'
									: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
							}`}
						>
							<Heart
								className={`h-5 w-5 ${isInFavorites ? 'fill-current' : ''}`}
							/>
							{isInFavorites ? t('inFavorites') : t('addToFavorites')}
						</button>
					</div>
					<div className='space-y-2.5 pt-4'>
						<div className='flex items-center gap-2.5 text-sm text-gray-700'>
							<Truck className='h-4 w-4 flex-shrink-0 text-gray-500' />
							<span>{t('freeShipping')}</span>
						</div>
						<div className='flex items-center gap-2.5 text-sm text-gray-700'>
							<RotateCcw className='h-4 w-4 flex-shrink-0 text-gray-500' />
							<span>{t('returnPeriod')}</span>
						</div>
						<div className='flex items-center gap-2.5 text-sm text-gray-700'>
							<Shield className='h-4 w-4 flex-shrink-0 text-gray-500' />
							<span>{t('officialWarranty')}</span>
						</div>
					</div>
				</div>
			)}
			{isOutOfStock && (
				<div className='rounded-lg border border-red-200 bg-red-50 p-4'>
					<p className='font-semibold text-red-900'>
						{t('temporarilyUnavailable')}
					</p>
					<p className='mt-1 text-sm text-red-700'>
						{t('chooseAnotherFrom')}{' '}
						<Link href='/' className='font-semibold underline'>
							{t('catalog')}
						</Link>
					</p>
				</div>
			)}
		</div>
	)
}
