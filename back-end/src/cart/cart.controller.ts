import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { UserRole } from '__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { CartService } from './cart.service'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { MergeCartDto } from './dto/merge-cart.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Authorization(UserRole.REGULAR)
	@Get()
	async getCart(@Authorized('id') userId: string) {
		return this.cartService.getCart(userId)
	}

	@Authorization(UserRole.REGULAR)
	@Post('items')
	async addCart(@Authorized('id') userId: string, @Body() dto: AddToCartDto) {
		return this.cartService.addItem(userId, dto.productId, dto.quantity)
	}

	@Authorization(UserRole.REGULAR)
	@Patch('items/:productId')
	async updateItem(
		@Authorized('id') userId: string,
		@Param('productId') productId: number,
		@Body() dto: UpdateCartItemDto
	) {
		return this.cartService.updateItem(userId, +productId, dto.quantity)
	}

	@Authorization(UserRole.REGULAR)
	@Delete('items/:productId')
	async removeItem(
		@Authorized('id') userId: string,
		@Param('productId') productId: number
	) {
		return this.cartService.removeItem(userId, +productId)
	}

	@Authorization(UserRole.REGULAR)
	@Delete()
	async clearCart(@Authorized('id') userId: string) {
		return this.cartService.clearCart(userId)
	}

	@Authorization(UserRole.REGULAR)
	@Post('merge')
	async mergeCart(@Authorized('id') userId: string, @Body() dto: MergeCartDto) {
		return this.cartService.mergeCart(userId, dto.items)
	}
}
