'use client'

import { ShippingFormData } from '@features/checkout'
import { ShippingForm } from '@features/checkout'
import { CheckoutNavigation, useCheckoutStore } from '@processes/checkout'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export function ShippingStep() {
	const { setShippingData } = useCheckoutStore()
	const formRef = useRef<HTMLFormElement>(null)
	const router = useRouter()

	const handleSubmit = (data: ShippingFormData) => {
		setShippingData(data)
		router.push('/cart?step=confirmation')
	}

	const handleNext = () => {
		formRef.current?.requestSubmit()
	}

	return (
		<div>
			<h2 className='mb-6 text-2xl font-bold'>Данные доставки</h2>

			<ShippingForm ref={formRef} onSubmit={handleSubmit} />

			<CheckoutNavigation onNext={handleNext} />
		</div>
	)
}
