'use client'
import Link from 'next/link'

import { type Product } from '@/entities/api/products'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const isOutOfStock = product.quantity === 0

	const CardWrapper = isOutOfStock ? 'div' : Link
	const wrapperProps = isOutOfStock 
		? {} 
		: { href: `/products/${product.slug}` }

	return (
		<CardWrapper
			{...wrapperProps}
			className={`group overflow-hidden rounded-lg border shadow-sm transition-all ${
				isOutOfStock
					? 'border-gray-300 bg-gray-100'
					: 'border-gray-200 bg-white hover:shadow-lg'
			}`}
		>
			<div className='relative aspect-square w-full overflow-hidden bg-gray-100'>
				{product.images.length > 0 ? (
					<img
						src={product.images[0]}
						alt={product.name}
						className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
							isOutOfStock ? 'opacity-50 grayscale' : ''
						}`}
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center text-gray-400'>
						Нет фото
					</div>
				)}
				{isOutOfStock && (
					<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40'>
						<span className='rounded-full bg-black px-4 py-2 text-sm font-bold text-white'>
							Нет в наличии
						</span>
					</div>
				)}
			</div>

			{/* Информация о товаре */}
			<div className='p-4'>
				{/* Категория */}
				{product.category && (
					<p className={`mb-1 text-xs uppercase ${
						isOutOfStock ? 'text-gray-400' : 'text-gray-500'
					}`}>
						{product.category.name}
					</p>
				)}

				{/* Название */}
				<h3 className={`mb-2 line-clamp-2 text-lg font-semibold group-hover:text-blue-600 ${
					isOutOfStock ? 'text-gray-500' : 'text-gray-900'
				}`}>
					{product.name}
				</h3>

				{/* Описание (опционально) */}
				<p className={`mb-3 line-clamp-2 text-sm ${
					isOutOfStock ? 'text-gray-400' : 'text-gray-600'
				}`}>
					{product.description}
				</p>

				{/* Количество в наличии */}
				{!isOutOfStock && product.quantity <= 10 && (
					<p className='mb-2 text-xs font-medium text-orange-600'>
						Осталось: {product.quantity} шт.
					</p>
				)}

				{/* Цена */}
				<div className='flex items-center justify-between'>
					<span className={`text-2xl font-bold ${
						isOutOfStock ? 'text-gray-500' : 'text-gray-900'
					}`}>
						${product.price}
					</span>
					<button
						onClick={e => {
							e.preventDefault()
							if (!isOutOfStock) {
								// Здесь будет добавление в корзину
								console.log('Add to cart:', product.id)
							}
						}}
						disabled={isOutOfStock}
						className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
							isOutOfStock
								? 'cursor-not-allowed bg-gray-400 text-gray-200'
								: 'bg-blue-600 text-white hover:bg-blue-700'
						}`}
					>
						{isOutOfStock ? 'Недоступно' : 'В корзину'}
					</button>
				</div>
			</div>
		</CardWrapper>
	)
}
