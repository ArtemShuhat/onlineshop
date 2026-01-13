export interface CartItem {
	productId: number
	name: string
	price: number
	quantity: number
	image?: string
}

export interface Cart {
	items: CartItem[]
	total: number
}

export interface LocalCartStore {
	items: CartItem[]
	addItem: (item: CartItem) => void
	removeItem: (productId: number) => void
	updateQuantity: (productId: number, quantity: number) => void
	clearCart: () => void
	getTotal: () => number
}
