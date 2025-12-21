'use client'

import { useSubmitOrder } from '@/features/checkout/submit-order/hooks/useSubmitOrder'

import { useCart } from '@/entities/cart/model/useCart'
import { useCheckoutStore } from '@/processes/checkout'

export function ConfirmationStep() {
	const { items, total } = useCart()
	const { mutate: submitOrder, isPending } = useSubmitOrder()
	const { shippingData, paymentMethod } = useCheckoutStore()

	return (
		<div>
			<h2 className='mb-6 text-2xl font-bold'>Подтверждение заказа</h2>

			<div className='space-y-6'>
				<div className='rounded-lg border bg-white p-6'>
					<h3 className='mb-4 text-lg font-semibold'>Адрес доставки</h3>
					<div className='space-y-2 text-gray-700'>
						<p>
							<strong>Адрес:</strong> {shippingData?.shippingAddress}
						</p>
						<p>
							<strong>Город:</strong> {shippingData?.shippingCity}
						</p>
						{shippingData?.shippingPostalCode && (
							<p>
								<strong>Индекс:</strong> {shippingData.shippingPostalCode}
							</p>
						)}
						<p>
							<strong>Телефон:</strong> {shippingData?.phoneNumber}
						</p>
						{shippingData?.notes && (
							<p>
								<strong>Примечания:</strong> {shippingData.notes}
							</p>
						)}
					</div>
				</div>

				<div className='rounded-lg border bg-white p-6'>
					<h3 className='mb-4 text-lg font-semibold'>Товары</h3>
					<div className='space-y-3'>
						{items.map(item => (
							<div key={item.productId} className='flex justify-between'>
								<span>
									{item.name} × {item.quantity}
								</span>
								<span className='font-semibold'>
									${item.price * item.quantity}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className='mb-4'>
					<h3>Способ оплаты</h3>
					<p>
						{paymentMethod === 'cash'
							? 'Оплата при получении'
							: 'Оплата картой'}
					</p>
				</div>

				<div className='rounded-lg bg-blue-50 p-6'>
					<div className='flex justify-between text-2xl font-bold'>
						<span>Всего к оплате:</span>
						<span className='text-blue-600'>${total}</span>
					</div>
				</div>

				<div className='flex justify-center'>
					<button
						onClick={() => submitOrder()}
						disabled={isPending}
						className='w-full max-w-md rounded-lg bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
					>
						{isPending ? 'Оформление...' : 'Подтвердить и оплатить'}
					</button>
				</div>
			</div>
		</div>
	)
}
