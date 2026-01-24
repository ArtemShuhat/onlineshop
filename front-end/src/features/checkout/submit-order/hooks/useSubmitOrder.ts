import { useMergeCart } from '@entities/cart'
import { useLocalCartStore } from '@entities/cart'
import { createOrder, createStripeCheckout } from '@entities/order'
import { useProfile } from '@entities/user'
import { useCheckoutStore } from '@processes/checkout'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSubmitOrder() {
	const { user } = useProfile()
	const { shippingData, reset } = useCheckoutStore()
	const localCart = useLocalCartStore()
	const { mutateAsync: mergeCart } = useMergeCart()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			if (!shippingData) throw new Error('Отсутствуют данные о доставке')

			if (user && localCart.items.length > 0) {
				await mergeCart(localCart.items)
				localCart.clearCart()
			}

			const order = await createOrder(shippingData)
			const { url } = await createStripeCheckout(order.id)

			return { order, stripeUrl: url }
		},
		onSuccess: ({ stripeUrl }) => {
			localCart.clearCart()
			queryClient.invalidateQueries({ queryKey: ['cart'] })
			reset()

			window.location.href = stripeUrl
		},
		onError: error => {
			console.error('Ошибка оформления заказа:', error)
		}
	})
}
