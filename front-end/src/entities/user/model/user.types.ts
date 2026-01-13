export enum UserRole {
	REGULAR = 'REGULAR',
	ADMIN = 'ADMIN'
}

export enum AuthMethod {
	CREDENTIALS = 'CREDENTIALS',
	GOOGLE = 'GOOGLE'
}

export interface Account {
	id: string
	createdAt: string
	updatedAt: string
	type: string
	provider: string
	refreshToken: string
	accessToken: string
	expiresAt: number
	userId: string
}

export interface User {
	id: string
	createdAt: string
	updatedAt: string
	email: string
	displayName: string
	picture: string
	role: UserRole
	isVerified: boolean
	isTwoFactorEnabled: boolean
	method: AuthMethod
}

export interface UserWithPassword extends User {
	password: string
	accounts: Account[]
}
