'use client'

import { authService } from '@features/auth'
import { TypeLoginSchema } from '@features/auth'
import { toastMessageHandler } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

export function useLoginMutation(
	setIsShowFactor: Dispatch<SetStateAction<boolean>>
) {
	const t = useTranslations('authToasts')
	const router = useRouter()

	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeLoginSchema
			recaptcha: string
		}) => authService.login(values, recaptcha),
		onSuccess(data: any) {
			if (data.message) {
				toastMessageHandler(data)
				setIsShowFactor(true)
			} else {
				toast.success(t('loginSuccess'))
				router.push('/')
			}
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { login, isLoadingLogin }
}
