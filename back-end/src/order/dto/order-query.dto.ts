import { OrderStatus } from '__generated__'
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
