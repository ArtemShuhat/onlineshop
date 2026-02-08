export interface Review {
	id: number
	rating: number
	comment: string
	isVerified: boolean
	createdAt: string
	updatedAt: string
	user: {
		id: string
		displayName: string
		picture: string | null
	}
}

export interface ReviewsResponse {
	reviews: Review[]
	pagination: {
		total: number
		page: number
		limit: number
		totalPages: number
	}
}
