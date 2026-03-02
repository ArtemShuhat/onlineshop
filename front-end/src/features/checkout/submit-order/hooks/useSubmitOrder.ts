'use client'

import { useMergeCart } from '@entities/cart'
import { useLocalCartStore } from '@entities/cart'
import { createOrder, createStripeCheckout } from '@entities/order'
import { useProfile } from '@entities/user'
import { useCheckoutStore } from '@processes/checkout'
import { toastMessageHandler } from '@shared/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

export function useSubmitOrder() {
	const t = useTranslations('confirmationStep')
	const { user } = useProfile()
	const { shippingData, promoCode, reset } = useCheckoutStore()
	const localCart = useLocalCartStore()
	const { mutateAsync: mergeCart } = useMergeCart()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			if (!shippingData) {
				throw new Error('Отсутствуют данные о доставке')
			}

			if (user && localCart.items.length > 0) {
				await mergeCart(localCart.items)
				localCart.clearCart()
			}

			const order = await createOrder({
				...shippingData,
				promoCode: promoCode.trim() || undefined
			})

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
			toastMessageHandler(error, {
				fallbackMessage: t('submitError'),
				id: 'checkout-submit-error'
			})
		}
	})
}
