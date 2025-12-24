'use client'

import { CheckoutStepper, useCheckoutStore } from '@/processes/checkout'
import { CartStep } from '@/widgets/checkout/cart-step/CartStep'
import { ConfirmationStep } from '@/widgets/checkout/confirmation-step/ConfirmationStep'
import { PaymentStep } from '@/widgets/checkout/payment-step/PaymentStep'
import { ShippingStep } from '@/widgets/checkout/shipping-step/ShippingStep'
import Header from '@/widgets/header/Header'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const stepMap: { [key: string]: number } = {
	cart: 1,
	address: 2,
	payment: 3,
	confirmation: 4
}

export default function CheckoutPage() {
	const searchParams = useSearchParams()
	const { currentStep, setCurrentStep } = useCheckoutStore()
	const stepParam = searchParams.get('step')

	useEffect(() => {
		if (stepParam && stepMap[stepParam]) {
			setCurrentStep(stepMap[stepParam])
		} else if (!stepParam) {
			setCurrentStep(1)
		}
	}, [stepParam, setCurrentStep])

	return (
		<>
			<Header />
			<div className='mx-auto min-h-screen max-w-4xl px-4 py-12'>
				<CheckoutStepper currentStep={currentStep} />

				<div className='rounded-lg bg-gray-50 p-8'>
					{currentStep === 1 && <CartStep />}
					{currentStep === 2 && <ShippingStep />}
					{currentStep === 3 && <PaymentStep />}
					{currentStep === 4 && <ConfirmationStep />}
				</div>
			</div>
		</>
	)
}
