import { NewVerificationForm } from '@features/auth/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return <NewVerificationForm />
}
