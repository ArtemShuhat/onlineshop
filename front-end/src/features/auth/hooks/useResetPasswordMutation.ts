'use client'

import { passwordRecoveryService } from '@features/auth'
import { TypeResetPasswordSchema } from '@features/auth'
import { toastMessageHandler } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useResetPasswordMutation() {
	const t = useTranslations('authToasts')
	const { mutate: reset, isPending: isLoadingReset } = useMutation({
		mutationKey: ['reset password'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeResetPasswordSchema
			recaptcha: string
		}) => passwordRecoveryService.reset(values, recaptcha),
		onSuccess() {
			toast.success(t('checkEmail'), {
				description: t('checkEmailDescription')
			})
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { reset, isLoadingReset }
}
