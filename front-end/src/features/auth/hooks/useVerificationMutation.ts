'use client'

import { verificationService } from '@features/auth'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useVerificationMutation() {
	const t = useTranslations('authToasts')
	const router = useRouter()

	const { mutate: verification } = useMutation({
		mutationKey: ['new verification'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess() {
			toast.success(t('emailVerified'))
			router.push('/dashboard/settings')
		},
		onError() {
			router.push('/auth/login')
		}
	})

	return { verification }
}
