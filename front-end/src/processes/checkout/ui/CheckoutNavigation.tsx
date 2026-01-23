'use client'

import { useCheckoutStore } from '@processes/checkout'
import { useRouter } from 'next/navigation'

interface CheckoutNavigationProps {
	onNext?: () => void
	onPrev?: () => void
	canProceed?: boolean
	isLastStep?: boolean
}

const stepPaths = ['cart', 'address', 'confirmation']

export function CheckoutNavigation({
	onNext,
	onPrev,
	canProceed = true,
	isLastStep = false
}: CheckoutNavigationProps) {
	const router = useRouter()
	const { currentStep } = useCheckoutStore()

	const handleNext = () => {
		if (onNext) {
			onNext()
		} else {
			const nextStepIndex = currentStep
			if (nextStepIndex < stepPaths.length) {
				router.push(`/cart?step=${stepPaths[nextStepIndex]}`)
			}
		}
	}

	const handlePrev = () => {
		if (onPrev) {
			onPrev()
		} else {
			const prevStepIndex = currentStep - 2
			if (prevStepIndex >= 0) {
				router.push(`/cart?step=${stepPaths[prevStepIndex]}`)
			}
		}
	}

	return (
		<div className='mt-8 flex justify-between'>
			<button
				onClick={handlePrev}
				disabled={currentStep === 1}
				className='rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
			>
				Назад
			</button>

			<button
				onClick={handleNext}
				disabled={!canProceed}
				className='rounded-lg bg-pur px-6 py-3 font-semibold text-white transition hover:bg-purh disabled:cursor-not-allowed disabled:opacity-50'
			>
				{isLastStep ? 'Оплатить' : 'Далее'}
			</button>
		</div>
	)
}
