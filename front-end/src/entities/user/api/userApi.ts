import { User } from '@entities/user'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function getProfile(): Promise<User> {
	const response = await fetch(`${SERVER_URL}/auth/profile`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Не удалось получить профиль.')
	}

	return response.json()
}
