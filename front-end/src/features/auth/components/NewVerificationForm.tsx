'use client'

import { useVerificationMutation } from '@features/auth'
import { AuthWrapper } from '@features/auth'
import { Loading } from '@shared/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function NewVerificationForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { verification } = useVerificationMutation()

	useEffect(() => {
		verification(token)
	}, [token])

	return (
		<AuthWrapper heading='Подтверждение почты'>
			<div>
				<Loading />
			</div>
		</AuthWrapper>
	)
}
