export interface Category {
	id: number
	name: string
	slug: string
	createdAt: string
	updatedAt: string
}

export interface CreateCategoryDto {
	name: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
