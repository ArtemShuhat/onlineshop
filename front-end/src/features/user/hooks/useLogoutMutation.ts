'use client'

import { authService } from '@features/auth'
import { toastMessageHandler } from '@shared/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useLogoutMutation() {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess() {
			queryClient.clear()
			toast.success('Вы успешно вышли из системы')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { logout, isLoadingLogout }
}
