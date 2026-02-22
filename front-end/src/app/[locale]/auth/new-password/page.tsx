import { NewPasswordForm } from '@features/auth'
import { Loading } from '@shared/ui'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Новый пароль'
}

export default function NewPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className='w-full'>
					<Loading />
				</div>
			}
		>
			<NewPasswordForm />
		</Suspense>
	)
}
