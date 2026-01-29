'use client'

import type { Product } from '@entities/product'
import { useAddToCart } from '@features/add-to-cart'
import { useFavoritesStore } from '@features/favorites'
import { Button } from '@shared/ui'
import {
	Heart,
	Minus,
	Plus,
	RotateCcw,
	Scale,
	Shield,
	ShoppingCart,
	Truck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductInfoProps {
	product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
	const [quantity, setQuantity] = useState(1)
	const router = useRouter()

	const { addToCart, isLoading } = useAddToCart()
	const { toggle, isFavorite } = useFavoritesStore()
	const isInFavorites = isFavorite(product.id)

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
			price: product.price,
			image: product.productImages?.[0]?.url
		})
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>

			<div className='flex items-center gap-2'>
				<div className='flex text-gray-300'>{'★'.repeat(5)}</div>
				<span className='text-sm text-gray-600'>(0 отзывов)</span>
			</div>

			<div className='py-4'>
				<span className='text-4xl font-bold text-gray-900'>
					${product.price}
				</span>
			</div>

			<div className='flex items-center gap-2'>
				{isOutOfStock ? (
					<>
						<span className='h-2.5 w-2.5 rounded-full bg-red-500'></span>
						<span className='font-medium text-red-700'>Нет в наличии</span>
					</>
				) : isLowStock ? (
					<>
						<span className='h-2.5 w-2.5 rounded-full bg-orange-500'></span>
						<span className='font-medium text-orange-700'>
							Осталось немного {product.quantity} шт.
						</span>
					</>
				) : (
					<>
						<span className='h-2.5 w-2.5 rounded-full bg-green-500'></span>
						<span className='font-medium text-green-700'>
							В наличии {product.quantity} шт.
						</span>
					</>
				)}
			</div>

			{product.category && (
				<div className='text-sm'>
					<span className='text-gray-600'>Категория: </span>
					<span className='font-medium text-gray-900'>
						{product.category.name}
					</span>
				</div>
			)}

			{!isOutOfStock && (
				<>
					<div className='space-y-2'>
						<label className='text-sm font-medium text-gray-700'>
							Количество:
						</label>
						<div className='flex items-center gap-3'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								disabled={quantity <= 1}
							>
								<Minus className='h-4 w-4' />
							</Button>

							<span className='w-16 text-center text-lg font-semibold'>
								{quantity}
							</span>

							<Button
								variant='outline'
								size='sm'
								onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
								disabled={quantity >= maxQuantity}
							>
								<Plus className='h-4 w-4' />
							</Button>
						</div>
					</div>

					<Button
						onClick={handleAddToCartAndGo}
						disabled={isLoading}
						className='h-12 w-full bg-pur py-4 text-lg text-white hover:bg-purh max-md:w-44 max-md:px-6 max-md:py-3 max-md:text-base'
					>
						<ShoppingCart className='mr-2 h-5 w-5 max-md:h-4 max-md:w-4' />
						{isLoading ? 'Добавление...' : 'В корзину'}
					</Button>

					<div className='flex justify-between gap-3'>
						<Button
							onClick={handleToggleFavorite}
							variant='outline'
							className={`h-12 w-[50%] py-4 text-lg transition-all max-md:w-44 max-md:px-6 max-md:py-3 max-md:text-base ${
								isInFavorites ? 'bg-white' : 'hover:bg-accent'
							}`}
						>
							<Heart
								className={`mr-2 h-5 w-5 max-md:h-4 max-md:w-4 ${
									isInFavorites ? 'fill-current' : ''
								}`}
							/>
							{isInFavorites ? 'В избранном' : 'В избранное'}
						</Button>
						<Button className='h-12 w-[50%] bg-white py-4 text-lg text-black hover:bg-accent max-md:w-44 max-md:px-6 max-md:py-3 max-md:text-base'>
							<Scale className='mr-2 h-5 w-5 max-md:h-4 max-md:w-4' />
							Сравнить
						</Button>
					</div>

					<div className='space-y-4 border-t pt-6'>
						<div className='flex items-start gap-3'>
							<Truck className='mt-0.5 h-5 w-5 shrink-0 text-gray-700' />
							<div>
								<p className='font-medium text-gray-900'>
									Бесплатная доставка от $50
								</p>
								<p className='text-sm text-gray-500'>
									Доставка за 2-4 рабочих дня
								</p>
							</div>
						</div>
						<div className='flex items-start gap-3'>
							<RotateCcw className='mt-0.5 h-5 w-5 shrink-0 text-gray-700' />
							<div>
								<p className='font-medium text-gray-900'>Простой возврат</p>
								<p className='text-sm text-gray-500'>
									Возврат в течение 30 дней
								</p>
							</div>
						</div>
						<div className='flex items-start gap-3'>
							<Shield className='mt-0.5 h-5 w-5 shrink-0 text-gray-700' />
							<div>
								<p className='font-medium text-gray-900'>60-дневная гарантия</p>
								<p className='text-sm text-gray-500'>Полный возврат средств</p>
							</div>
						</div>
					</div>
				</>
			)}

			{isOutOfStock && (
				<div className='rounded-lg border border-red-200 bg-red-50 p-4'>
					<p className='font-medium text-red-700'>Товар временно недоступен</p>
					<p className='mt-1 text-sm text-red-600'>
						Вы можете выбрать другой товар из каталога
					</p>
				</div>
			)}
		</div>
	)
}
