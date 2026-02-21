'use client'

import { useCurrencyStore } from '@entities/currency'
import { formatProductPrice } from '@entities/currency/lib/getProductPrice'
import { cn } from '@shared/utils'

interface PriceTagProps {
	priceUSD: number
	priceEUR?: number | null
	priceUAH?: number | null
	className?: string
}

export function PriceTag({
	priceUSD,
	priceEUR,
	priceUAH,
	className
}: PriceTagProps) {
	const { currency } = useCurrencyStore()

	const formatted = formatProductPrice(
		{ priceUSD, priceEUR, priceUAH },
		currency
	)

	return <span className={cn('inline-block', className)}>{formatted}</span>
}
