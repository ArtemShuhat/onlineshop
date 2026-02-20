'use client'

import { PriceTag } from '@entities/currency'
import { type Product } from '@entities/product'
import { useAddToCart } from '@features/add-to-cart'
import { FavoriteButton } from '@features/favorites/ui/FavoriteButton'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
	product: Product
	hideCartButton?: boolean
}

export function ProductCard({ product, hideCartButton }: ProductCardProps) {
	const isOutOfStock = product.quantity === 0
	const isLowStock = product.quantity > 0 && product.quantity <= 10
	const isInStock = product.quantity > 10

	const { addToCart, isLoading } = useAddToCart()

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!isOutOfStock) {
			addToCart(product, 1)
		}
	}

	return (
		<Link
			href={`/products/${product.slug}`}
			className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl'
		>
			<div className='relative aspect-[4/3] w-full overflow-hidden bg-gray-100'>
				{product.productImages && product.productImages.length > 0 ? (
					<Image
						src={
							product.productImages.find(img => img.isMain)?.url ||
							product.productImages[0]?.url
						}
						fill
						sizes='(max-width: 768px) 50vw, 25vw'
						alt={product.name}
						className='object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center text-lg text-gray-400 max-xs:text-sm'>
						Нет фото
					</div>
				)}
				<FavoriteButton
					product={{
						id: product.id,
						name: product.name,
						slug: product.slug,
						price: product.priceUSD,
						image: product.productImages?.[0]?.url
					}}
					className='absolute right-2 top-2'
				/>
			</div>

			<div className='p-6 max-xs:p-3'>
				<h3 className='mb-3 line-clamp-2 min-h-[56px] text-xl font-semibold text-gray-900 max-xs:mb-2 max-xs:min-h-[40px] max-xs:text-sm'>
					{product.name}
				</h3>

				<div className='mb-4 flex items-center gap-2 max-xs:mb-2'>
					{isInStock && (
						<>
							<span className='h-2.5 w-2.5 rounded-full bg-green-500 max-xs:h-1.5 max-xs:w-1.5'></span>
							<span className='text-sm font-medium text-green-700 max-xs:text-xs'>
								В наличии
							</span>
						</>
					)}
					{isLowStock && (
						<>
							<span className='h-2.5 w-2.5 rounded-full bg-orange-500 max-xs:h-1.5 max-xs:w-1.5'></span>
							<span className='text-sm font-medium text-orange-700 max-xs:text-xs'>
								Осталось немного
							</span>
						</>
					)}
				</div>

				<div className='flex items-center justify-between'>
					<PriceTag
						priceUSD={product.priceUSD}
						priceEUR={product.priceEUR}
						priceUAH={product.priceUAH}
						className='text-3xl font-bold text-gray-900 max-xs:text-lg'
					/>
					{isOutOfStock ? (
						<>
							<div className='flex items-center gap-2'>
								<span className='h-2.5 w-2.5 rounded-full bg-red-500 max-xs:h-1.5 max-xs:w-1.5'></span>
								<span className='text-sm font-medium text-red-700 max-xs:text-xs'>
									Нет в наличии
								</span>
							</div>
						</>
					) : (
						<button
							onClick={handleAddToCart}
							disabled={isLoading}
							className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all max-xs:gap-1 max-xs:px-3 max-xs:py-1.5 max-xs:text-xs ${
								isLoading
									? 'bg-pura text-white'
									: 'bg-pur text-white hover:bg-purh hover:shadow-md'
							}`}
						>
							<ShoppingCart className='h-4 w-4 max-xs:h-3 max-xs:w-3' />
							{!hideCartButton && (
								<span className='max-xs:hidden'>
									{isLoading ? 'Добавление...' : 'В корзину'}
								</span>
							)}
						</button>
					)}
				</div>
			</div>
		</Link>
	)
}
