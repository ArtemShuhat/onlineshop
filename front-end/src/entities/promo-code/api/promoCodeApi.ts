const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface PromoCode {
	id: number
	code: string
	percentOff: number
	isActive: boolean
	minOrderAmount: number | null
	maxUses: number | null
	usedCount: number
	startsAt: string | null
	expiresAt: string | null
	createdAt: string
	updatedAt: string
}

export interface CreatePromoCodePayload {
	code?: string
	percentOff: number
	minOrderAmount?: number
	maxUses?: number
	startsAt?: string
	expiresAt?: string
	isActive?: boolean
}

export interface PromoCodeValidationResult {
	promoCode: string
	subtotal: number
	discountAmount: number
	total: number
}

export async function getAdminPromoCodes() {
	const response = await fetch(`${SERVER_URL}/promo-codes/admin`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка загрузки промокодов')
	}

	return response.json() as Promise<PromoCode[]>
}

export async function createPromoCode(data: CreatePromoCodePayload) {
	const response = await fetch(`${SERVER_URL}/promo-codes/admin`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка создания промокода')
	}

	return response.json() as Promise<PromoCode>
}

export async function updatePromoCodeStatus(id: number, isActive: boolean) {
	const response = await fetch(`${SERVER_URL}/promo-codes/admin/${id}/status`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ isActive })
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка обновления промокода')
	}

	return response.json() as Promise<PromoCode>
}

export async function validatePromoCode(code: string) {
	const response = await fetch(`${SERVER_URL}/promo-codes/validate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ code })
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка проверки промокода')
	}

	return response.json() as Promise<PromoCodeValidationResult>
}
