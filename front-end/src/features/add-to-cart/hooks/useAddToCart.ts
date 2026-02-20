import { useAddToServerCart } from '@entities/cart'
import { useLocalCartStore } from '@entities/cart'
import { ProductImage } from '@entities/product'
import { useProfile } from '@entities/user'
import { getMainProductImage } from '@shared/lib'
import { useState } from 'react'
import { toast } from 'sonner'

interface Product {
	id: number
	name: string
	priceUSD: number
	productImages: ProductImage[]
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
					price: product.priceUSD,
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

	return {
		addToCart,
		isLoading: isServerPending || isAdding
	}
}
