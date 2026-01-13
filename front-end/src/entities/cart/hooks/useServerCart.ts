import * as cartApi from '@entities/cart'
import { useProfile } from '@entities/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useServerCart() {
	const { user } = useProfile()

	return useQuery({
		queryKey: ['cart'],
		queryFn: cartApi.getCart,
		enabled: !!user,
		staleTime: 1000 * 60 * 5
	})
}

export function useAddToServerCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			productId,
			quantity
		}: {
			productId: number
			quantity: number
		}) => cartApi.addToCart(productId, quantity),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] })
		}
	})
}

export function useUpdateToServerItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			productId,
			quantity
		}: {
			productId: number
			quantity: number
		}) => cartApi.updateCartItem(productId, quantity),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] })
		}
	})
}

export function useRemoveFromServerCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (productId: number) => cartApi.removeFromCart(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] })
		}
	})
}

export function useMergeCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: cartApi.migrateCart,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] })
		}
	})
}
