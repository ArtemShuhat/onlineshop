'use client'

import { authService } from '@features/auth'
import { TypeRegisterSchema } from '@features/auth'
import { toastMessageHandler } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useRegisterMutation() {
	const t = useTranslations('authToasts')
	const router = useRouter()

	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeRegisterSchema
			recaptcha: string
		}) => authService.register(values, recaptcha),
		onSuccess(data: any) {
			toast.success(data?.message || t('registerSuccess'))
			router.push('/')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
