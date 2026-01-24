export interface ShippingData {
	firstName: string
	lastName: string
	email: string
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}

export enum CheckoutStep {
	CART = 1,
	SHIPPING_DETAILS = 2,
	CONFIRMATION = 3
}

export interface CheckoutStore {
	currentStep: number
	shippingData: ShippingData | null
	highestVisitedStep: number 

	setCurrentStep: (step: number) => void
	setShippingData: (data: ShippingData) => void
	nextStep: () => void
	prevStep: () => void
	reset: () => void
}
