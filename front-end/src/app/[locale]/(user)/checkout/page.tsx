'use client'

import { CartStep, ConfirmationStep, ShippingStep } from '@processes/checkout'
import { CheckoutStepper, useCheckoutStore } from '@processes/checkout'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const stepMap: { [key: string]: number } = {
	cart: 1,
	shippingDetails: 2,
	confirmation: 3
}

function CheckoutPageContent() {
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
		<div className='mx-auto min-h-screen max-w-4xl px-4 py-12'>
			<CheckoutStepper currentStep={currentStep} />

			<div className='rounded-lg bg-gray-50 p-8'>
				{currentStep === 1 && <CartStep />}
				{currentStep === 2 && <ShippingStep />}
				{currentStep === 3 && <ConfirmationStep />}
			</div>
		</div>
	)
}

export default function CheckoutPage() {
	return (
		<Suspense fallback={<div className='p-8'>Загрузка...</div>}>
			<CheckoutPageContent />
		</Suspense>
	)
}
