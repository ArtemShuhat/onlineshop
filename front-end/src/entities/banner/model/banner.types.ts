export type BannerSlot = 'FEATURED' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'

export interface Banner {
	id: number
	url: string
	order: number
	isActive: boolean
	slot: BannerSlot
	createdAt: string
	updatedAt: string
}

export interface CreateBannerDto {
	url: string
	order?: number
	slot?: BannerSlot
}

export interface UpdateBannerDto {
	url?: string
	order?: number
	isActive?: boolean
	slot?: BannerSlot
}
