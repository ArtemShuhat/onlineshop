import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { UserRole } from '@prisma/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/user/decorators/user.decorator'

import { CreateReviewDto } from './dto/create-review.dto'
import { ReviewQueryDto } from './dto/review-query.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}
	// 3) findOne
	// 4) update
	// 5) delete
	// 6) updateProductRating

	@Post()
	@Authorization()
	create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
		return this.reviewService.create(userId, dto)
	}

	@Get()
	findAll(@Query() query: ReviewQueryDto) {
		return this.reviewService.findAll(query)
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.reviewService.findOne(id)
	}

	@Put()
	@Authorization()
	update(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('id') userId: string,
		@Body() dto: UpdateReviewDto
	) {
		return this.reviewService.update(id, userId, dto)
	}

	@Delete()
	@Authorization()
	delete(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser('id') userId: string,
		@CurrentUser('role') role: UserRole
	) {
		const isAdmin = role === UserRole.ADMIN
		return this.reviewService.delete(id, userId, isAdmin)
	}
}
