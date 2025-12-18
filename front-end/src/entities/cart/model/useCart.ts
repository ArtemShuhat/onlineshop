import { useServerCart } from '../api/useServerCart'

import { useLocalCartStore } from './localCartStore'
import { useProfile } from '@/entities/api'

export function useCart() {
	const { user } = useProfile()
	const { data: serverCart, isLoading } = useServerCart()
	const localCart = useLocalCartStore()

	if (user) {
		return {
			items: serverCart?.items || [],
			total: serverCart?.total || 0,
			isLoading,
			isLocal: false
		}
	}

	return {
		items: localCart.items,
		total: localCart.getTotal(),
		isLoading: false,
		isLocal: true
	}
}
