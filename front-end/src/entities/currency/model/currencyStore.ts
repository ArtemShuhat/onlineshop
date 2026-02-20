import { Currency } from 'lucide-react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Currency = 'USD' | 'EUR' | 'UAH'

export const CURRENCY_CONFIG: Record<
	Currency,
	{ symbol: string; label: string }
> = {
	USD: { symbol: '$', label: 'Доллар США' },
	EUR: { symbol: '€', label: 'Евро' },
	UAH: { symbol: '₴', label: 'Гривна' }
}

interface CurrencyState {
	currency: Currency
	setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyState>()(
	persist(
		set => ({
			currency: 'USD',
			setCurrency: currency => set({ currency })
		}),
		{ name: 'currency-store' }
	)
)
