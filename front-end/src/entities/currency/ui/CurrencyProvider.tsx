'use client'

import { type PropsWithChildren, useRef } from 'react'
import type { StoreApi } from 'zustand/vanilla'

import type { Currency } from '../model/currency.constants'
import {
	type CurrencyState,
	CurrencyStoreContext,
	createCurrencyStore
} from '../model/currencyStore'

interface CurrencyProviderProps extends PropsWithChildren {
	initialCurrency: Currency
}

export function CurrencyProvider({
	children,
	initialCurrency
}: CurrencyProviderProps) {
	const storeRef = useRef<StoreApi<CurrencyState> | null>(null)

	if (!storeRef.current) {
		storeRef.current = createCurrencyStore(initialCurrency)
	}

	return (
		<CurrencyStoreContext.Provider value={storeRef.current}>
			{children}
		</CurrencyStoreContext.Provider>
	)
}
