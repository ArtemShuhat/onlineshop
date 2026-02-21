'use client'

import { type ProductSortBy } from '@entities/product'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

import { ProductSort } from './ProductSort'

interface QueryProductSortProps {
	value: ProductSortBy | undefined
	paramName?: string
}

export function QueryProductSort({
	value,
	paramName = 'sortBy'
}: QueryProductSortProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	const handleChange = (nextValue: ProductSortBy | undefined) => {
		if (!pathname) return

		const params = new URLSearchParams(searchParams?.toString() ?? '')

		if (nextValue) {
			params.set(paramName, nextValue)
		} else {
			params.delete(paramName)
		}

		const query = params.toString()
		const nextUrl = query ? `${pathname}?${query}` : pathname

		startTransition(() => {
			router.replace(nextUrl, { scroll: false })
		})
	}

	return (
		<div className={isPending ? 'pointer-events-none opacity-70' : ''}>
			<ProductSort value={value} onChange={handleChange} />
		</div>
	)
}
