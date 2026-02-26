import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedProduct {
	id: number
	name: string
	slug: string
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

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
	persist(
		(set, get) => ({
			products: [],

			addProduct: product => {
				const { products } = get()

				const filtered = products.filter(p => p.id !== product.id)

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
			version: 2,
			migrate: persistedState => {
				const state = persistedState as RecentlyViewedState
				if (!state?.products?.length) return state

				return {
					...state,
					products: state.products.map(product => ({
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
