import { User } from '@entities/user'
import { TypeLoginSchema, TypeRegisterSchema } from '@features/auth'
import { api } from '@shared/api'

class AuthService {
	public async register(body: TypeRegisterSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		const response = await api.post<User>('auth/register', body, {
			headers
		})

		return response
	}

	public async login(body: TypeLoginSchema, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		const response = await api.post<User>('auth/login', body, {
			headers
		})

		return response
	}

	public async oauthByProvider(provider: 'google') {
		const response = await api.get<{ url: string }>(
			`auth/oauth/connect/${provider}`
		)

		return response
	}

	public async logout() {
		const response = await api.post('auth/logout')

		return response
	}
}

export const authService = new AuthService()
