import { useEffect, useRef } from 'react'

import { useMergeCart } from '../api/useServerCart'

import { useLocalCartStore } from './localCartStore'
import { useProfile } from '@/entities/api'

export function useSyncCart() {
	const { user, isLoading } = useProfile()
	const { mutate: mergeCart } = useMergeCart()
	const localCart = useLocalCartStore()

	const syncedForUser = useRef<string | null>(null)

	useEffect(() => {
		if (isLoading) {
			return
		}

		if (!user) {
			syncedForUser.current = null
			return
		}

		if (syncedForUser.current === user.id) {
			return
		}

		if (localCart.items.length === 0) {
			syncedForUser.current = user.id
			return
		}

		const timer = setTimeout(() => {
			syncedForUser.current = user.id

			mergeCart(localCart.items, {
				onSuccess: () => {
					localCart.clearCart()
				},
				onError: error => {
					console.error('Ошибка миграции корзины:', error)
					syncedForUser.current = null
				}
			})
		}, 500)
		return () => clearTimeout(timer)
	}, [user?.id, isLoading])
}
