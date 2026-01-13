'use client'

import { useCart } from '@entities/cart'
import { CheckoutNavigation } from '@processes/checkout'

export function CartStep() {
	const { items, total, updateQuantity, removeItem } = useCart()

	if (items.length === 0) {
		return (
			<div className='py-20 text-center'>
				<p className='text-xl text-gray-500'>Корзина пуста</p>
			</div>
		)
	}

	return (
		<div>
			<h2 className='mb-6 text-2xl font-bold'>Ваша корзина</h2>

			<div className='space-y-4'>
				{items.map(item => (
					<div
						key={item.productId}
						className='flex items-center gap-4 rounded-lg border bg-white p-4'
					>
						{item.image && (
							<img
								src={item.image}
								alt={item.name}
								className='h-20 w-20 rounded object-cover'
							/>
						)}
						<div className='flex-1'>
							<h3 className='font-semibold'>{item.name}</h3>
							<p className='text-gray-600'>${item.price}</p>
						</div>
						<div className='flex items-center gap-2'>
							<button
								onClick={() =>
									updateQuantity(item.productId, item.quantity - 1)
								}
								disabled={item.quantity <= 1}
								className='h-8 w-8 rounded bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200'
							>
								-
							</button>
							<span className='w-8 text-center'>{item.quantity}</span>
							<button
								onClick={() =>
									updateQuantity(item.productId, item.quantity + 1)
								}
								className='h-8 w-8 rounded bg-gray-200 hover:bg-gray-300'
							>
								+
							</button>
						</div>

						<p className='w-24 text-right font-bold'>
							${item.price * item.quantity}
						</p>
						<button
							onClick={() => removeItem(item.productId)}
							className='text-red-600 hover:text-red-800'
						>
							Удалить
						</button>
					</div>
				))}
			</div>

			<div className='mt-6 rounded-lg bg-gray-50 p-6'>
				<div className='flex justify-between text-xl font-bold'>
					<span>Всего:</span>
					<span>${total}</span>
				</div>
			</div>

			<CheckoutNavigation canProceed={items.length > 0} />
		</div>
	)
}
