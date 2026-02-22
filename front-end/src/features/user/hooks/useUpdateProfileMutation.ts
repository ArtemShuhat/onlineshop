'use client'

import { TypeSettingsSchema } from '@features/user'
import { userService } from '@features/user'
import { toastMessageHandler } from '@shared/utils'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useUpdateProfileMutation() {
	const t = useTranslations('userToasts')
	const { mutate: update, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeSettingsSchema) => userService.updateProfile(data),
		onSuccess() {
			toast.success(t('profileUpdated'))
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { update, isLoadingUpdate }
}
