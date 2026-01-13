import type { LocalCartStore } from '@entities/cart'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLocalCartStore = create<LocalCartStore>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: item =>
				set(state => {
					const existing = state.items.find(i => i.productId === item.productId)
					if (existing) {
						return {
							items: state.items.map(i =>
								i.productId === item.productId
									? { ...i, quantity: i.quantity + item.quantity }
									: i
							)
						}
					}
					return { items: [...state.items, item] }
				}),

			removeItem: productId =>
				set(state => ({
					items: state.items.filter(i => i.productId !== productId)
				})),

			updateQuantity: (productId, quantity) =>
				set(state => {
					if (quantity <= 0) {
						return { items: state.items.filter(i => i.productId !== productId) }
					}
					return {
						items: state.items.map(i =>
							i.productId === productId ? { ...i, quantity } : i
						)
					}
				}),

			clearCart: () => set({ items: [] }),

			getTotal: () => {
				const { items } = get()
				return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
			}
		}),
		{ name: 'local-cart' }
	)
)
