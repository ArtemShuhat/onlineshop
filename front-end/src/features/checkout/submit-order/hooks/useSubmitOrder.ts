import { useMergeCart } from '@entities/cart'
import { useLocalCartStore } from '@entities/cart'
import { createOrder, createStripeCheckout } from '@entities/order'
import { useProfile } from '@entities/user'
import { useCheckoutStore } from '@processes/checkout'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useSubmitOrder() {
	const router = useRouter()
	const { user } = useProfile()
	const { shippingData, paymentMethod, reset } = useCheckoutStore()
	const localCart = useLocalCartStore()
	const { mutateAsync: mergeCart } = useMergeCart()
	const queryClient = useQueryClient()

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

			const order = await createOrder(orderData)

			if (paymentMethod === 'card') {
				const { url } = await createStripeCheckout(order.id)
				return { order, stripeUrl: url }
			}

			return { order, stripeUrl: null }
		},
		onSuccess: ({ order, stripeUrl }) => {
			localCart.clearCart()
			queryClient.invalidateQueries({ queryKey: ['cart'] })
			reset()

			if (stripeUrl) {
				window.location.href = stripeUrl
			} else {
				router.push(`/orders/${order.id}`)
			}
		}
	})
}
