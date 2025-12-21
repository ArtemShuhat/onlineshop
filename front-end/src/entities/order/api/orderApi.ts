const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface CreateOrderDto {
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
	paymentMethod: 'cash' | 'card'
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

export async function getUserOrders() {
	const response = await fetch(`${SERVER_URL}/order`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка загрузки заказов')
	}

	return response.json()
}

export async function getOrderById(orderId: number) {
	const response = await fetch(`${SERVER_URL}/order/${orderId}`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка загрузки заказа')
	}

	return response.json()
}

export async function getAllOrders(filters?: {
	status?: string
	userId?: string
	search?: string
}) {
	const params = new URLSearchParams()
	if (filters?.status) params.append('status', filters.status)
	if (filters?.userId) params.append('userId', filters.userId)
	if (filters?.search) params.append('search', filters.search)

	const response = await fetch(
		`${SERVER_URL}/order/admin/all?${params.toString()}`,
		{
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
