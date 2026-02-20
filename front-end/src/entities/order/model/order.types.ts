import type { ProductImage } from '@entities/product'

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
	unitPrice: number
	currency: string
	product: {
		id: number
		name: string
		priceUSD: number
		priceEUR: number
		priceUAH: number
		productImages: ProductImage[]
		slug: string
	}
}

export interface Order {
	id: number
	status: OrderStatus
	totalPrice: number
	currency: string
	orderItems: OrderItem[]
	user: {
		id: string
		email: string
		displayName: string
		picture?: string
	}
	firstName: string
	lastName: string
	email: string
	createdAt: string
	updatedAt: string
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}

export interface CreateOrderData {
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}
