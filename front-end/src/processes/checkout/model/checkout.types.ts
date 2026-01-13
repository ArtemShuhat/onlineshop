export interface ShippingData {
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}

export type PaymentMethod = 'cash' | 'card'

export enum CheckoutStep {
	CART = 1,
	SHIPPING = 2,
	PAYMENT = 3,
	CONFIRMATION = 4
}

export interface CheckoutStore {
	currentStep: number
	shippingData: ShippingData | null
	paymentMethod: PaymentMethod | null

	setCurrentStep: (step: number) => void
	setShippingData: (data: ShippingData) => void
	setPaymentMethod: (method: PaymentMethod) => void
	nextStep: () => void
	prevStep: () => void
	reset: () => void
}
