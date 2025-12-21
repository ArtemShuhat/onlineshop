'use client'

import { useRef } from 'react'

import { ShippingFormData } from '@/features/checkout/shipping-form/schema/shipping.schema'
import { ShippingForm } from '@/features/checkout/shipping-form/ui/ShippingForm'

import { CheckoutNavigation, useCheckoutStore } from '@/processes/checkout'

export function ShippingStep() {
	const { setShippingData, nextStep } = useCheckoutStore()
	const formRef = useRef<HTMLFormElement>(null)

	const handleSubmit = (data: ShippingFormData) => {
		setShippingData(data)
		nextStep()
	}

	const handleNext = () => {
		formRef.current?.requestSubmit()
	}

	return (
		<div>
			<h2 className='mb-6 text-2xl font-bold'>Адреса доставки</h2>

			<ShippingForm ref={formRef} onSubmit={handleSubmit} />

			<CheckoutNavigation onNext={handleNext} />
		</div>
	)
}
