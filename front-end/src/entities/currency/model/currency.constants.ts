export type Currency = 'USD' | 'EUR' | 'UAH'

export const DEFAULT_CURRENCY: Currency = 'USD'
export const CURRENCY_COOKIE_NAME = 'preferred_currency'
export const CURRENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const CURRENCY_CONFIG: Record<
	Currency,
	{ symbol: string; labelKey: string }
> = {
	USD: { symbol: '$', labelKey: 'preferences.currencyLabels.USD' },
	EUR: { symbol: '€', labelKey: 'preferences.currencyLabels.EUR' },
	UAH: { symbol: '₴', labelKey: 'preferences.currencyLabels.UAH' }
}

export function isCurrency(
	value: string | null | undefined
): value is Currency {
	return value === 'USD' || value === 'EUR' || value === 'UAH'
}

export function parseCurrency(value: string | null | undefined): Currency {
	return isCurrency(value) ? value : DEFAULT_CURRENCY
}
