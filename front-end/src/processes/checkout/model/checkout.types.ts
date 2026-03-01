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

export interface DiscountPreview {
	promoCode: string
	subtotal: number
	discountAmount: number
	total: number
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
	promoCode: string
	discountPreview: DiscountPreview | null

	setCurrentStep: (step: number) => void
	setShippingData: (data: ShippingData) => void
	setPromoCode: (code: string) => void
	setDiscountPreview: (preview: DiscountPreview | null) => void
	clearPromoCode: () => void
	nextStep: () => void
	prevStep: () => void
	reset: () => void
}
