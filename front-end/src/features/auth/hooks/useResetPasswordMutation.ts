import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { passwordRecoveryService } from '../api/password-recovery.service'
import { TypeResetPasswordSchema } from '../schemes/reset-password.schema'

export function useResetPasswordMutation() {
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
			toast.success('Проверьте почту', {
				description: 'На вашу почту была отправлена ссылка для подтверждения.'
			})
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { reset, isLoadingReset }
}
