import { useState } from 'react'
import { toast } from 'sonner'

import { useProfile } from '@/entities/api'
import { useAddToServerCart } from '@/entities/cart/api/useServerCart'
import { useLocalCartStore } from '@/entities/cart/model/localCartStore'

interface Product {
	id: number
	name: string
	price: number
	images: string[]
}

export function useAddToCart() {
	const { user } = useProfile()
	const { mutate: addToServer, isPending: isServerPending } =
		useAddToServerCart()
	const addToLocal = useLocalCartStore(state => state.addItem)
	const [isAdding, setIsAdding] = useState(false)

	const addToCart = (product: Product, quantity: number = 1) => {
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

	return {
		addToCart,
		isLoading: isServerPending || isAdding
	}
}
