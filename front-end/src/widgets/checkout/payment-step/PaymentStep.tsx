'use client'

import { CheckoutNavigation, useCheckoutStore } from '@/processes/checkout'

export function PaymentStep() {
	const { paymentMethod, setPaymentMethod } = useCheckoutStore()

	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-bold'>Способ оплаты</h2>

			<div className='space-y-4'>
				<label className='flex cursor-pointer items-center gap-3'>
					<input
						type='radio'
						name='payment'
						value='cash'
						checked={paymentMethod === 'cash'}
						onChange={e => setPaymentMethod(e.target.value as 'cash' | 'card')}
						className='h-4 w-4'
					/>
					<span>Оплата при получении</span>
				</label>

				<label className='flex cursor-pointer items-center gap-3'>
					<input
						type='radio'
						name='payment'
						value='card'
						checked={paymentMethod === 'card'}
						onChange={e => setPaymentMethod(e.target.value as 'cash' | 'card')}
						className='h-4 w-4'
					/>
					<span>Оплата картой</span>
				</label>
			</div>

			<CheckoutNavigation canProceed={!!paymentMethod} />
		</div>
	)
}
