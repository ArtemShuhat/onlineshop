import {
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	RawBodyRequest,
	Req
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { StripeService } from './stripe.service'

@Controller('api/stripe')
export class StripeController {
	constructor(private readonly stripeService: StripeService) {}

	@Authorization(UserRole.ADMIN, UserRole.REGULAR)
	@Post('checkout/:orderId')
	async createCheckoutSession(
		@Param('orderId', ParseIntPipe) orderId: number,
		@Authorized('id') userId: string
	) {
		return this.stripeService.createCheckoutSession(orderId, userId)
	}

	@Post('webhook')
	@HttpCode(HttpStatus.OK)
	async handleWebhook(
		@Req() req: RawBodyRequest<Request>,
		@Headers('stripe-signature') signature: string
	) {
		return this.stripeService.handleWebhook(req.rawBody, signature)
	}
}
