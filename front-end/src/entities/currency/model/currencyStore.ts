import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Currency = 'USD' | 'EUR' | 'UAH'

export const CURRENCY_CONFIG: Record<
	Currency,
	{ symbol: string; labelKey: string }
> = {
	USD: { symbol: '$', labelKey: 'preferences.currencyLabels.USD' },
	EUR: { symbol: '€', labelKey: 'preferences.currencyLabels.EUR' },
	UAH: { symbol: '₴', labelKey: 'preferences.currencyLabels.UAH' }
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
