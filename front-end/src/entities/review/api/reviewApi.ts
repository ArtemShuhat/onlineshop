import type { Review, ReviewsResponse } from '@entities/review'
import { api } from '@shared/api'

export const reviewApi = {
	getReviews: async (
		productId: number,
		page = 1,
		limit = 10
	): Promise<ReviewsResponse> => {
		return await api.get<ReviewsResponse>('reviews', {
			params: { productId, page, limit }
		})
	},

	createReview: async (
		productId: number,
		rating: number,
		comment: string
	): Promise<Review> => {
		return await api.post<Review>('reviews', {
			productId,
			rating,
			comment
		})
	},

	updateReview: async (
		id: number,
		rating?: number,
		comment?: string
	): Promise<Review> => {
		return await api.put<Review>(`reviews/${id}`, {
			rating,
			comment
		})
	},

	deleteReview: async (id: number): Promise<{ message: string }> => {
		return await api.delete<{ message: string }>(`reviews/${id}`)
	},

	canReview: async (
		productId: number
	): Promise<{
		canReview: boolean
		reason?: string
		message: string
	}> => {
		return await api.get<{
			canReview: boolean
			reason?: string
			message: string
		}>(`reviews/can-review/${productId}`)
	}
}
