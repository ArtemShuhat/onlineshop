'use client'

import { ProductImage } from '@entities/api/productsApi'
import { getMainProductImage } from '@shared/lib/getProductImages'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/Button'

import { useProfile } from '@/entities/api'
import { useAddToServerCart } from '@/entities/cart/api/useServerCart'
import { useLocalCartStore } from '@/entities/cart/model/localCartStore'

interface AddToCartButtonProps {
	product: {
		id: number
		name: string
		price: number
		productImages: ProductImage[]
	}
	quantity?: number
	className?: string
}

export function AddToCartButton({
	product,
	quantity = 1,
	className
}: AddToCartButtonProps) {
	const { user } = useProfile()
	const { mutate: addToServer, isPending } = useAddToServerCart()
	const addToLocal = useLocalCartStore(state => state.addItem)
	const [isAdding, setIsAdding] = useState(false)

	const handleAddToCart = () => {
		setIsAdding(true)

		if (user) {
			addToServer(
				{ productId: product.id, quantity },
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
					quantity,
					image: getMainProductImage(product.productImages) || ''
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
		<Button
			onClick={handleAddToCart}
			disabled={isPending || isAdding}
			className={className}
		>
			<ShoppingCart className='mr-2 h-4 w-4' />
			{isPending || isAdding ? 'Добавление...' : 'В корзину'}
		</Button>
	)
}
