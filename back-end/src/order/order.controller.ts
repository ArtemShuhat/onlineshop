import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query
} from '@nestjs/common'
import { UserRole } from '@prisma/client'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrderQueryDto } from './dto/order-query.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrderService } from './order.service'

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Authorization(UserRole.REGULAR)
	@Post()
	async createOrder(
		@Authorized('id') userId: string,
		@Body() dto: CreateOrderDto
	) {
		return this.orderService.createOrder(userId, dto)
	}

	@Authorization(UserRole.REGULAR)
	@Get()
	async getUserOrders(@Authorized('id') userId: string) {
		return this.orderService.getUserOrders(userId)
	}

	@Get('pending-count')
	@Authorization(UserRole.ADMIN, UserRole.REGULAR)
	async getPendingCount(@Authorized('id') userId: string) {
		return this.orderService.getPendingOrdersCount(userId)
	}

	@Authorization(UserRole.REGULAR)
	@Get(':id')
	async getOrderById(
		@Param('id', ParseIntPipe) id: number,
		@Authorized('id') userId: string
	) {
		return this.orderService.getOrderById(id, userId)
	}

	@Authorization(UserRole.ADMIN)
	@Get('admin/all')
	async getAllOrders(@Query() query: OrderQueryDto) {
		return this.orderService.getAllOrders(query)
	}

	@Authorization(UserRole.ADMIN)
	@Patch('admin/:id/status')
	async updateOrderStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateOrderStatusDto
	) {
		return this.orderService.updateOrderStatus(id, dto.status)
	}

	@Authorization(UserRole.ADMIN)
	@Get('admin/:id')
	async getOrderByIdAdmin(@Param('id', ParseIntPipe) id: number) {
		return this.orderService.getOrderById(id)
	}
}
