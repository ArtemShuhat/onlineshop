'use client'

import { useRouter } from 'next/navigation'

interface CheckoutStepperProps {
	currentStep: number
}

const steps = [
	{ number: 1, label: 'Корзина', path: '/cart?step=cart' },
	{ number: 2, label: 'Адрес доставки', path: '/cart?step=address' },
	{ number: 3, label: 'Подтверждение', path: '/cart?step=confirmation' }
]

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
	const router = useRouter()

	const handleStepClick = (step: (typeof steps)[0]) => {
		if (step.number <= currentStep) {
			router.push(step.path)
		}
	}

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-center gap-8'>
				{steps.map(step => (
					<button
						key={step.number}
						onClick={() => handleStepClick(step)}
						disabled={step.number > currentStep}
						className={`flex flex-col items-center gap-3 transition-all ${
							step.number <= currentStep
								? 'cursor-pointer'
								: 'cursor-not-allowed opacity-50'
						}`}
					>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
								currentStep === step.number
									? 'border-purh bg-pur text-white'
									: currentStep > step.number
										? 'border-gray-400 bg-white text-gray-700'
										: 'border-gray-300 bg-white text-gray-400'
							}`}
						>
							{step.number}
						</div>
						<span
							className={`text-sm font-medium ${
								currentStep === step.number
									? 'text-gray-900'
									: currentStep > step.number
										? 'text-gray-700'
										: 'text-gray-400'
							}`}
						>
							{step.label}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}
