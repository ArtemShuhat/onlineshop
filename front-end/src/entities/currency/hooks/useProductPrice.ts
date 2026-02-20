import {
	PricedProduct,
	formatProductPrice,
	useCurrencyStore
} from '@entities/currency'
import { getProductPrice } from '@entities/currency'

export function useProductPrice(product: PricedProduct) {
	const { currency } = useCurrencyStore()

	return {
		price: getProductPrice(product, currency),
		formatted: formatProductPrice(product, currency),
		currency
	}
}
