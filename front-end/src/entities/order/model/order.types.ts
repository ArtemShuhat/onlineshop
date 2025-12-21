export enum OrderStatus {
	PENDING = 'PENDING',
	PAYED = 'PAYED',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED'
}

export interface OrderItem {
	id: number
	quantity: number
	amountItem: number
	product: {
		id: number
		name: string
		price: number
		images: string[]
	}
}

export interface Order {
	id: number
	status: OrderStatus
	totalPrice: number
	orderItems: OrderItem[]
	user: {
		id: string
		email: string
		displayName: string
		picture?: string
	}
	createdAt: string
	updatedAt: string
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
	paymentMethod: 'CASH' | 'CARD'
}

export interface CreateOrderData {
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}
