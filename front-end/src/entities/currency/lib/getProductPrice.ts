import { CURRENCY_CONFIG, Currency, PricedProduct } from '@entities/currency'

export function getProductPrice(
	product: PricedProduct,
	currency: Currency
): number {
	switch (currency) {
		case 'EUR':
			return product.priceEUR || product.priceUSD
		case 'UAH':
			return product.priceUAH || product.priceUSD
		default:
			return product.priceUSD
	}
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
	const price = getProductPrice(product, currency)
	return formatPrice(price, currency)
}
