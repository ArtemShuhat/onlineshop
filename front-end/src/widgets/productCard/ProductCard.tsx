'use client'

import { type Product } from '@entities/api/productsApi'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { useProfile } from '@/entities/api'
import { useAddToServerCart } from '@/entities/cart/api/useServerCart'
import { useLocalCartStore } from '@/entities/cart/model/localCartStore'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const isOutOfStock = product.quantity === 0
	const isLowStock = product.quantity > 0 && product.quantity <= 10
	const isInStock = product.quantity > 10

	const { user } = useProfile()
	const { mutate: addToServer, isPending } = useAddToServerCart()
	const addToLocal = useLocalCartStore(state => state.addItem)
	const [isAdding, setIsAdding] = useState(false)

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isOutOfStock) return

		setIsAdding(true)

		if (user) {
			addToServer(
				{ productId: product.id, quantity: 1 },
				{
					onSuccess: () => {
						toast.success(`${product.name} добавлен в корзину`)
						setIsAdding(false)
					},
					onError: (error: any) => {
						toast.error(error.message || 'Не удалось добавить в корзину')
						setIsAdding(false)
					}
				}
			)
		} else {
			try {
				addToLocal({
					productId: product.id,
					name: product.name,
					price: product.price,
					quantity: 1,
					image: product.images[0]
				})
				toast.success(`${product.name} добавлен в корзину`)
			} catch (error) {
				toast.error('Ошибка добавления в корзину')
			} finally {
				setIsAdding(false)
			}
		}
	}

	return (
		<Link
			href={`/products/${product.slug}`}
			className='group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg'
		>
			<div className='relative aspect-square w-full overflow-hidden bg-gray-100'>
				{product.images.length > 0 ? (
					<img
						src={product.images[0]}
						alt={product.name}
						className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center text-gray-400'>
						Нет фото
					</div>
				)}
			</div>

			<div className='p-4'>
				<h3 className='mb-2 line-clamp-1 text-lg font-semibold text-gray-900'>
					{product.name}
				</h3>

				<div className='mb-3 flex items-center gap-2'>
					{isInStock && (
						<>
							<span className='h-2 w-2 rounded-full bg-green-500'></span>
							<span className='text-sm text-green-700'>В наличии</span>
						</>
					)}
					{isLowStock && (
						<>
							<span className='h-2 w-2 rounded-full bg-orange-500'></span>
							<span className='text-sm text-orange-700'>Осталось немного</span>
						</>
					)}
					{isOutOfStock && (
						<>
							<span className='h-2 w-2 rounded-full bg-red-500'></span>
							<span className='text-sm text-red-700'>Нет в наличии</span>
						</>
					)}
				</div>

				<div className='flex items-center justify-between'>
					<span className='text-2xl font-bold text-gray-900'>
						${product.price}
					</span>
					<button
						onClick={handleAddToCart}
						disabled={isOutOfStock || isPending || isAdding}
						className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
							isOutOfStock
								? 'cursor-not-allowed bg-gray-300 text-gray-500'
								: isPending || isAdding
									? 'bg-blue-400 text-white'
									: 'bg-blue-600 text-white hover:bg-blue-700'
						}`}
					>
						<ShoppingCart className='h-4 w-4' />
						{isPending || isAdding
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
