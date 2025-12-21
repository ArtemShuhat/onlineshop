import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useProfile } from '@/entities/api'
import { useMergeCart } from '@/entities/cart/api/useServerCart'
import { useLocalCartStore } from '@/entities/cart/model/localCartStore'
import { createOrder } from '@/entities/order'
import { useCheckoutStore } from '@/processes/checkout'

export function useSubmitOrder() {
	const router = useRouter()
	const { user } = useProfile()
	const { shippingData, paymentMethod, reset } = useCheckoutStore()
	const localCart = useLocalCartStore()
	const { mutateAsync: mergeCart } = useMergeCart()

	return useMutation({
		mutationFn: async () => {
			if (!shippingData) throw new Error('Отсутствуют данные о доставке')
			if (!paymentMethod) throw new Error('Не выбран способ оплаты')

			if (user && localCart.items.length > 0) {
				console.log('Синхронизация корзины перед созданием заказа...')
				await mergeCart(localCart.items)
				localCart.clearCart()
			}

			const orderData = {
				...shippingData,
				paymentMethod
			}

			console.log('Отправка заказа:', orderData)

			return createOrder(orderData)
		},
		onSuccess: order => {
			reset()
			router.push(`/orders/${order.id}`)
		}
	})
}
