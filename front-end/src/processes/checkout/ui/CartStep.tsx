'use client'

import { useCart } from '@entities/cart'
import { CartCheckoutContent } from '@features/cart-checkout'
import { CheckoutNavigation } from '@processes/checkout'

export function CartStep() {
	const { items } = useCart()

	return (
		<CartCheckoutContent
			footer={<CheckoutNavigation canProceed={items.length > 0} />}
		/>
	)
}
