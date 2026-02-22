'use client'

import { useLocalCartStore, useMergeCart } from '@entities/cart'
import { useProfile } from '@entities/user'
import { useEffect, useRef } from 'react'

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
					syncedForUser.current = null
				}
			})
		}, 500)
		return () => clearTimeout(timer)
	}, [user?.id, isLoading])
}
