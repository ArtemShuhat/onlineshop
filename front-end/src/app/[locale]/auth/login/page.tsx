import { LoginForm } from '@features/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Войти в аккаунт'
}

export default function LoginPage() {
	return <LoginForm />
}
