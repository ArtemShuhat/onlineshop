import { Banner, CreateBannerDto, UpdateBannerDto } from '@entities/banner'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function getBanners(init?: RequestInit): Promise<Banner[]> {
	const response = await fetch(`${SERVER_URL}/banners`, init)

	if (!response.ok) {
		throw new Error('Ошибка при загрузке баннеров')
	}

	return response.json()
}

export async function getBannersAdmin(): Promise<Banner[]> {
	const response = await fetch(`${SERVER_URL}/banners/admin`, {
		credentials: 'include'
	})

	if (!response.ok) {
		throw new Error('Ошибка при загрузке баннеров')
	}

	return response.json()
}

export async function createBanner(data: CreateBannerDto): Promise<Banner> {
	const response = await fetch(`${SERVER_URL}/banners`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при создании баннера')
	}

	return response.json()
}

export async function updateBanner(
	id: number,
	data: UpdateBannerDto
): Promise<Banner> {
	const response = await fetch(`${SERVER_URL}/banners/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при обновлении баннера')
	}

	return response.json()
}

export async function deleteBanner(id: number): Promise<void> {
	const response = await fetch(`${SERVER_URL}/banners/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при удалении баннера')
	}
}

export async function reorderBanners(bannerIds: number[]): Promise<Banner[]> {
	const response = await fetch(`${SERVER_URL}/banners/reorder`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ bannerIds })
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при изменении порядка баннеров')
	}

	return response.json()
}
