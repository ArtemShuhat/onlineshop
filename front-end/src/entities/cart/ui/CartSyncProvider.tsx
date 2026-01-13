'use client'

import { useSyncCart } from '@entities/cart'

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
	useSyncCart()
	return <>{children}</>
}
