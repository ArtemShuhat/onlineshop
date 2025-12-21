import { OrderStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class OrderQueryDto {
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@IsOptional()
	@IsString()
	userId?: string

	@IsOptional()
	@IsString()
	search?: string
}
