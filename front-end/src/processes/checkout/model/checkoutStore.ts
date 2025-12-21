import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShippingData {
	shippingAddress: string
	shippingCity: string
	shippingPostalCode?: string
	phoneNumber: string
	notes?: string
}

interface CheckoutStore {
	currentStep: number
	shippingData: ShippingData | null
	paymentMethod: 'cash' | 'card' | null

	setCurrentStep: (step: number) => void
	setShippingData: (data: ShippingData) => void
	setPaymentMethod: (method: 'cash' | 'card') => void
	nextStep: () => void
	prevStep: () => void
	reset: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
	persist(
		set => ({
			currentStep: 1,
			shippingData: null,
			paymentMethod: null,

			setCurrentStep: step => set({ currentStep: step }),
			setShippingData: data => set({ shippingData: data }),
			setPaymentMethod: method => set({ paymentMethod: method }),
			nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
			prevStep: () =>
				set(state => ({ currentStep: Math.max(1, state.currentStep - 1) })),
			reset: () =>
				set({ currentStep: 1, shippingData: null, paymentMethod: null })
		}),
		{
			name: 'checkout-storage',
			partialState: state => ({
				shippingData: state.shippingData,
				paymentMethod: state.paymentMethod
			})
		}
	)
)
