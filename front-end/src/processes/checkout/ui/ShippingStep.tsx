'use client'

import { ShippingForm, ShippingFormData } from '@features/checkout'
import { CheckoutNavigation, useCheckoutStore } from '@processes/checkout'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export function ShippingStep() {
	const t = useTranslations('shippingStep')
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
			<h2 className='mb-6 text-2xl font-bold'>{t('title')}</h2>

			<ShippingForm ref={formRef} onSubmit={handleSubmit} />

			<CheckoutNavigation onNext={handleNext} />
		</div>
	)
}
