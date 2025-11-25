import { NewPasswordForm } from '@features/auth/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Новый пароль'
}

export default function NewPasswordPage() {
	return <NewPasswordForm />
}
