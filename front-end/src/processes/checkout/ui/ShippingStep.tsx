'use client'

import { ShippingFormData } from '@features/checkout'
import { ShippingForm } from '@features/checkout'
import { CheckoutNavigation, useCheckoutStore } from '@processes/checkout'
import { useRef } from 'react'

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
