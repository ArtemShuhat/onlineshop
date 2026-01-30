export interface Banner {
	id: number
	url: string
	order: number
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface CreateBannerDto {
	url: string
	order?: number
}

export interface UpdateBannerDto {
	url?: string
	order?: number
	isActive?: boolean
}
