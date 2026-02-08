import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewQueryDto } from './dto/review-query.dto'
import { UpdateReviewDto } from './dto/update-review.dto'

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, dto: CreateReviewDto) {
		const product = await this.prisma.product.findUnique({
			where: { id: dto.productId }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		const existingReview = await this.prisma.review.findUnique({
			where: {
				userId_productId: {
					userId,
					productId: dto.productId
				}
			}
		})

		if (existingReview) {
			throw new BadRequestException('Вы уже оставили отзыв на этот товар')
		}

		const hasPurchased = await this.prisma.orderItem.findFirst({
			where: {
				productId: dto.productId,
				order: {
					userId,
					status: 'DELIVERED'
				}
			}
		})

		if (!hasPurchased) {
			throw new BadRequestException(
				'Вы можете оставить отзыв только на товары, которые приобрели'
			)
		}

		const review = await this.prisma.review.create({
			data: {
				rating: dto.rating,
				comment: dto.comment,
				userId,
				productId: dto.productId,
				isVerified: true
			},
			include: {
				user: {
					select: {
						id: true,
						displayName: true,
						picture: true
					}
				}
			}
		})

		await this.updateProductRating(dto.productId)

		return review
	}

	async findAll(query: ReviewQueryDto) {
		const { productId, limit = 10, page = 1, rating } = query

		const where = {
			...(productId && { productId }),
			...(rating && { rating })
		}

		const [reviews, total] = await Promise.all([
			this.prisma.review.findMany({
				where,
				include: {
					user: {
						select: {
							id: true,
							displayName: true,
							picture: true
						}
					}
				},
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			this.prisma.review.count({ where })
		])

		return {
			reviews,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		}
	}

	async findOne(id: number) {
		const review = await this.prisma.review.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						displayName: true,
						picture: true
					}
				},
				product: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			}
		})

		if (!review) {
			throw new NotFoundException('Отзыв не найден.')
		}

		return review
	}

	async update(id: number, userId: string, dto: UpdateReviewDto) {
		const review = await this.prisma.review.findUnique({ where: { id } })

		if (!review) {
			throw new NotFoundException('Отзыв не найден.')
		}

		if (review.userId !== userId) {
			throw new BadRequestException(
				'Вы можете редактировать только свои отзывы.'
			)
		}

		const updatedReview = await this.prisma.review.update({
			where: { id },
			data: dto,
			include: {
				user: {
					select: {
						id: true,
						displayName: true,
						picture: true
					}
				}
			}
		})

		if (dto.rating !== undefined) {
			await this.updateProductRating(review.productId)
		}

		return updatedReview
	}

	async delete(id: number, userId: string, isAdmin = false) {
		const review = await this.prisma.review.findUnique({ where: { id } })

		if (!review) {
			throw new NotFoundException('Отзыв не найден.')
		}

		if (!isAdmin && review.userId !== userId) {
			throw new BadRequestException('Вы можете удалять только свои отзывы.')
		}

		await this.prisma.review.delete({ where: { id } })

		await this.updateProductRating(review.productId)

		return { message: 'Отзыв успешно удален.' }
	}

	async updateProductRating(productId: number) {
		const stats = await this.prisma.review.aggregate({
			where: { productId },
			_avg: { rating: true },
			_count: { id: true }
		})

		await this.prisma.product.update({
			where: { id: productId },
			data: {
				averageRating: stats._avg.rating || 0,
				reviewCount: stats._count.id
			}
		})
	}

	async canReview(userId: string, productId: number) {
		const product = await this.prisma.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			throw new NotFoundException('Товар не найден')
		}

		const existingReview = await this.prisma.review.findUnique({
			where: {
				userId_productId: {
					userId,
					productId
				}
			}
		})

		if (existingReview) {
			return {
				canReview: false,
				reason: 'already_reviewed',
				message: 'Вы уже оставили отзыв на этот товар'
			}
		}

		const hasPurchased = await this.prisma.orderItem.findFirst({
			where: {
				productId,
				order: {
					userId,
					status: 'DELIVERED'
				}
			}
		})

		if (!hasPurchased) {
			return {
				canReview: false,
				reason: 'not_purchased',
				message: 'Вы можете оставить отзыв только на товары, которые приобрели'
			}
		}

		return {
			canReview: true,
			message: 'Вы можете оставить отзыв'
		}
	}
}
