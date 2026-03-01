import type { CheckoutStore } from '@processes/checkout'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCheckoutStore = create<CheckoutStore>()(
	persist(
		set => ({
			currentStep: 1,
			highestVisitedStep: 1,
			shippingData: null,
			promoCode: '',
			discountPreview: null,

			setCurrentStep: step =>
				set(state => ({
					currentStep: step,
					highestVisitedStep: Math.max(step, state.highestVisitedStep)
				})),
			setShippingData: data => set({ shippingData: data }),
			setPromoCode: code => set({ promoCode: code }),
			setDiscountPreview: preview => set({ discountPreview: preview }),
			clearPromoCode: () => set({ promoCode: '', discountPreview: null }),
			nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
			prevStep: () =>
				set(state => ({ currentStep: Math.max(1, state.currentStep - 1) })),
			reset: () =>
				set({
					currentStep: 1,
					highestVisitedStep: 1,
					shippingData: null,
					promoCode: '',
					discountPreview: null
				})
		}),
		{
			name: 'checkout-storage',
			partialize: state => ({
				shippingData: state.shippingData,
				highestVisitedStep: state.highestVisitedStep,
				promoCode: state.promoCode,
				discountPreview: state.discountPreview
			})
		}
	)
)
