const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface Category {
	id: number
	name: string
	createdAt: string
	updatedAt: string
}

export interface CreateCategoryDto {
	name: string
}

export interface UpdateCategoryDto {
	name: string
}

export async function getCategories(): Promise<Category[]> {
	const response = await fetch(`${SERVER_URL}/categories`)

	if (!response.ok) {
		throw new Error('Ошибка при загрузке категорий')
	}

	return response.json()
}

export async function createCategory(
	data: CreateCategoryDto
): Promise<Category> {
	const response = await fetch(`${SERVER_URL}/categories`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при создании категории')
	}

	return response.json()
}

export async function updateCategory(
	id: number,
	data: UpdateCategoryDto
): Promise<Category> {
	const response = await fetch(`${SERVER_URL}/categories/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при обновлении категории')
	}

	return response.json()
}

export async function deleteCategory(id: number): Promise<void> {
	const response = await fetch(`${SERVER_URL}/categories/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка при удалении категории')
	}
}
