import {
	useRemoveFromServerCart,
	useServerCart,
	useUpdateToServerItem
} from '../api/useServerCart'

import { useLocalCartStore } from './localCartStore'
import { useProfile } from '@/entities/api'

export function useCart() {
	const { user } = useProfile()
	const { data: serverCart, isLoading } = useServerCart()
	const updateToServerItem = useUpdateToServerItem()
	const removeFromServerCart = useRemoveFromServerCart()
	const localCart = useLocalCartStore()

	if (user) {
		return {
			items: serverCart?.items || [],
			total: serverCart?.total || 0,
			isLoading,
			isLocal: false,
			updateQuantity: (productId: number, quantity: number) =>
				updateToServerItem.mutate({ productId, quantity }),
			removeItem: (productId: number) => removeFromServerCart.mutate(productId)
		}
	}

	return {
		items: localCart.items,
		total: localCart.getTotal(),
		isLoading: false,
		isLocal: true,
		updateQuantity: localCart.updateQuantity,
		removeItem: localCart.removeItem
	}
}
