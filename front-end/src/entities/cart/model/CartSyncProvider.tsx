'use client'

import { useSyncCart } from './useSyncCart'

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
	useSyncCart()
	return <>{children}</>
}
