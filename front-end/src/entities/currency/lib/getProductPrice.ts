import { CURRENCY_CONFIG, Currency, PricedProduct } from '@entities/currency'

const isValidPrice = (value: number | null | undefined): value is number =>
	typeof value === 'number' && Number.isFinite(value)

export function getProductPrice(
	product: PricedProduct,
	currency: Currency
): number {
	if (currency === 'EUR' && isValidPrice(product.priceEUR))
		return product.priceEUR
	if (currency === 'UAH' && isValidPrice(product.priceUAH))
		return product.priceUAH
	return product.priceUSD
}

export function formatPrice(amount: number, currency: Currency): string {
	const { symbol } = CURRENCY_CONFIG[currency]
	const formatted = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount)

	return currency === 'UAH' ? `${formatted} ${symbol}` : `${symbol}${formatted}`
}

export function formatProductPrice(
	product: PricedProduct,
	currency: Currency
): string {
	if (currency === 'EUR' && isValidPrice(product.priceEUR)) {
		return formatPrice(product.priceEUR, 'EUR')
	}

	if (currency === 'UAH' && isValidPrice(product.priceUAH)) {
		return formatPrice(product.priceUAH, 'UAH')
	}

	return formatPrice(product.priceUSD, 'USD')
}
