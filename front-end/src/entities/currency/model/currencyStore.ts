'use client'

import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { type StoreApi, createStore } from 'zustand/vanilla'

import {
	CURRENCY_CONFIG,
	CURRENCY_COOKIE_MAX_AGE,
	CURRENCY_COOKIE_NAME,
	type Currency,
	DEFAULT_CURRENCY
} from './currency.constants'

export type { Currency }
export { CURRENCY_CONFIG }

export interface CurrencyState {
	currency: Currency
	setCurrency: (currency: Currency) => void
}

export const CurrencyStoreContext =
	createContext<StoreApi<CurrencyState> | null>(null)

function writeCurrencyCookie(currency: Currency) {
	document.cookie = `${CURRENCY_COOKIE_NAME}=${currency}; Path=/; Max-Age=${CURRENCY_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function createCurrencyStore(
	initialCurrency: Currency = DEFAULT_CURRENCY
) {
	return createStore<CurrencyState>()(set => ({
		currency: initialCurrency,
		setCurrency: currency => {
			writeCurrencyCookie(currency)
			set({ currency })
		}
	}))
}

export function useCurrencyStore(): CurrencyState
export function useCurrencyStore<T>(selector: (state: CurrencyState) => T): T
export function useCurrencyStore<T>(selector?: (state: CurrencyState) => T) {
	const store = useContext(CurrencyStoreContext)

	if (!store) {
		throw new Error('useCurrencyStore must be used within CurrencyProvider')
	}

	if (selector) {
		return useStore(store, selector)
	}

	return useStore(store, state => state) as T
}
