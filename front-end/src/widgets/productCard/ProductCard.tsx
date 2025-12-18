'use client'

import { type Product } from '@entities/api/productsApi'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { useAddToCart } from '@/features/add-to-cart/hooks/useAddToCart'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
				{product.images.length > 0 ? (
					<img
						src={product.images[0]}
						alt={product.name}
						className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center text-lg text-gray-400'>
						Нет фото
					</div>
				)}
			</div>

			<div className='p-6'>
				<h3 className='mb-3 line-clamp-2 min-h-[56px] text-xl font-semibold text-gray-900'>
					{product.name}
				</h3>

				<div className='mb-4 flex items-center gap-2'>
					{isInStock && (
						<>
							<span className='h-2.5 w-2.5 rounded-full bg-green-500'></span>
							<span className='text-sm font-medium text-green-700'>
								В наличии
							</span>
						</>
					)}
					{isLowStock && (
						<>
							<span className='h-2.5 w-2.5 rounded-full bg-orange-500'></span>
							<span className='text-sm font-medium text-orange-700'>
								Осталось немного
							</span>
						</>
					)}
					{isOutOfStock && (
						<>
							<span className='h-2.5 w-2.5 rounded-full bg-red-500'></span>
							<span className='text-sm font-medium text-red-700'>
								Нет в наличии
							</span>
						</>
					)}
				</div>

				<div className='flex items-center justify-between'>
					<span className='text-3xl font-bold text-gray-900'>
						${product.price}
					</span>
					<button
						onClick={handleAddToCart}
						disabled={isOutOfStock || isLoading}
						className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
							isOutOfStock
								? 'cursor-not-allowed bg-gray-300 text-gray-500'
								: isLoading
									? 'bg-blue-400 text-white'
									: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
						}`}
					>
						<ShoppingCart className='h-4 w-4' />
						{isLoading
							? 'Добавление...'
							: isOutOfStock
								? 'Недоступно'
								: 'В корзину'}
					</button>
				</div>
			</div>
		</Link>
	)
}
