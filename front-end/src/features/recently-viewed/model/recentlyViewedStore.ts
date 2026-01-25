import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedProduct {
	id: number
	name: string
	slug: string
	price: number
	image?: string
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
			name: 'recently-viewed-products'
		}
	)
)
