export interface Category {
	id: number
	nameRu: string
	nameEn: string
	nameUk: string
	createdAt: string
	updatedAt: string
}

export interface CreateCategoryDto {
	nameRu: string
	nameEn: string
	nameUk: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
