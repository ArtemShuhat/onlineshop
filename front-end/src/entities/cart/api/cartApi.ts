const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

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

export async function getCart(): Promise<Cart> {
	const response = await fetch(`${SERVER_URL}/cart`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка при загрузке корзины')
	}

	return response.json()
}

export async function addToCart(
	productId: number,
	quantity: number
): Promise<Cart> {
	const response = await fetch(`${SERVER_URL}/cart/items`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ productId, quantity })
	})

	if (!response.ok) {
		throw new Error('Ошибка добавления в корзину')
	}

	return response.json()
}

export async function updateCartItem(
	productId: number,
	quantity: number
): Promise<Cart> {
	const response = await fetch(`${SERVER_URL}/cart/items/${productId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ quantity })
	})

	if (!response.ok) {
		throw new Error('Ошибка обновления корзины')
	}

	return response.json()
}

export async function removeFromCart(productId: number): Promise<void> {
	const response = await fetch(`${SERVER_URL}/cart/items/${productId}`, {
		method: 'DELETE',
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка при удалении из корзины')
	}
}

export async function migrateCart(items: Cart[]): Promise<Cart> {
	const response = await fetch(`${SERVER_URL}/cart/merge`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ items })
	})

	if (!response.ok) {
		throw new Error('Ошибка миграции корзины')
	}

	return response.json()
}
