import { User } from '@entities/user'
import { TypeSettingsSchema } from '@features/user'
import { api } from '@shared/api'

class UserService {
	public async findProfile() {
		const response = await api.get<User>('users/profile')

		return response
	}

	public async updateProfile(body: TypeSettingsSchema) {
		const response = await api.patch<User>('users/profile', body)

		return response
	}
}

export const userService = new UserService()
