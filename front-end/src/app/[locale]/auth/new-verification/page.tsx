import { NewVerificationForm } from '@features/auth'
import { Loading } from '@shared/ui'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return (
		<Suspense
			fallback={
				<div className='w-full'>
					<Loading />
				</div>
			}
		>
			<NewVerificationForm />
		</Suspense>
	)
}
