const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface CreateOrderDto {
	firstName: string
	lastName: string
	email: string
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}

export async function createOrder(data: CreateOrderDto) {
	const response = await fetch(`${SERVER_URL}/order`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка создания заказа')
	}

	return response.json()
}

export async function getUserOrders(init?: RequestInit) {
	const response = await fetch(`${SERVER_URL}/order`, {
		...init,
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка загрузки заказов')
	}

	return response.json()
}

export async function getOrderById(orderId: number, init?: RequestInit) {
	const response = await fetch(`${SERVER_URL}/order/${orderId}`, {
		...init,
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка загрузки заказа')
	}

	return response.json()
}

export async function getAllOrders(
	filters?: {
		status?: string
		userId?: string
		search?: string
	},
	init?: RequestInit
) {
	const params = new URLSearchParams()
	if (filters?.status) params.append('status', filters.status)
	if (filters?.userId) params.append('userId', filters.userId)
	if (filters?.search) params.append('search', filters.search)

	const response = await fetch(
		`${SERVER_URL}/order/admin/all?${params.toString()}`,
		{
			...init,
			credentials: 'include'
		}
	)

	if (!response.ok) {
		throw new Error('Ошибка загрузки заказов')
	}

	return response.json()
}

export async function updateOrderStatus(orderId: number, status: string) {
	const response = await fetch(`${SERVER_URL}/order/admin/${orderId}/status`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ status })
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка обновления статуса')
	}

	return response.json()
}

export async function createStripeCheckout(orderId: number) {
	const response = await fetch(`${SERVER_URL}/api/stripe/checkout/${orderId}`, {
		method: 'POST',
		credentials: 'include'
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка создании сессии оплаты')
	}

	return response.json() as Promise<{ url: string }>
}

export async function getPendingOrdersCount() {
	const response = await fetch(`${SERVER_URL}/order/pending-count`, {
		credentials: 'include'
	})

	if (!response.ok) {
		return { count: 0 }
	}

	return response.json() as Promise<{ count: number }>
}
