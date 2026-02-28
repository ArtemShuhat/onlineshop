import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedProduct {
	id: number
	name: string
	slug: string
	variantGroupKey?: string | null
	listingGroupKey?: string | null
	priceUSD: number
	priceEUR?: number | null
	priceUAH?: number | null
	price?: number
	image?: string
	quantity: number
	viewedAt: number
}

interface RecentlyViewedState {
	products: RecentlyViewedProduct[]
	addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void
	clearProducts: () => void
}

const MAX_PRODUCTS = 10

function buildRecentlyViewedGroupKey(
	product: Pick<RecentlyViewedProduct, 'name' | 'listingGroupKey'>
) {
	return (
		product.listingGroupKey?.trim() ||
		product.name
			.normalize('NFKC')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase()
	)
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
	persist(
		(set, get) => ({
			products: [],

			addProduct: product => {
				const { products } = get()
				const productGroupKey = buildRecentlyViewedGroupKey(product)

				const filtered = products.filter(
					p =>
						p.id !== product.id &&
						buildRecentlyViewedGroupKey(p) !== productGroupKey
				)

				const updated = [
					{ ...product, viewedAt: Date.now() },
					...filtered
				].slice(0, MAX_PRODUCTS)

				set({ products: updated })
			},

			clearProducts: () => set({ products: [] })
		}),
		{
			name: 'recently-viewed-products',
			version: 4,
			migrate: persistedState => {
				const state = persistedState as RecentlyViewedState
				if (!state?.products?.length) return state

				const seenKeys = new Set<string>()
				const dedupedProducts = state.products.filter(product => {
					const key = buildRecentlyViewedGroupKey(product)
					if (seenKeys.has(key)) {
						return false
					}

					seenKeys.add(key)
					return true
				})

				return {
					...state,
					products: dedupedProducts.map(product => ({
						...product,
						priceUSD:
							(typeof product.priceUSD === 'number' &&
								Number.isFinite(product.priceUSD)
								? product.priceUSD
								: typeof product.price === 'number' &&
										Number.isFinite(product.price)
									? product.price
									: 0),
						priceEUR:
							typeof product.priceEUR === 'number' &&
							Number.isFinite(product.priceEUR)
								? product.priceEUR
								: null,
						priceUAH:
							typeof product.priceUAH === 'number' &&
							Number.isFinite(product.priceUAH)
								? product.priceUAH
								: null
					}))
				}
			}
		}
	)
)
