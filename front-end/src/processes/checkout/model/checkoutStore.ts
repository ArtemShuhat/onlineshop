import type { CheckoutStore } from '@processes/checkout'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
			partialize: state => ({
				shippingData: state.shippingData,
				paymentMethod: state.paymentMethod
			})
		}
	)
)
