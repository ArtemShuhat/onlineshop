import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteProduct {
	id: number
	name: string
	slug: string
	price: number
	image?: string
}

interface FavoritesState {
	products: FavoriteProduct[]
	add: (product: FavoriteProduct) => void
	remove: (productId: number) => void
	toggle: (product: FavoriteProduct) => void
	isFavorite: (productId: number) => boolean
	clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
	persist(
		(set, get) => ({
			products: [],

			add: (product: FavoriteProduct) => {
				const { products } = get()
				if (!products.find(p => p.id === product.id)) {
					set({ products: [...products, product] })
				}
			},

			remove: (productId: number) => {
				set({ products: get().products.filter(p => p.id !== productId) })
			},

			toggle: (product: FavoriteProduct) => {
				const { products, add, remove } = get()
				if (products.find(p => p.id === product.id)) {
					remove(product.id)
				} else {
					add(product)
				}
			},

			isFavorite: (productId: number) => {
				return get().products.some(p => p.id === productId)
			},

			clear: () => set({ products: [] })
		}),
		{
			name: 'favorites'
		}
	)
)
