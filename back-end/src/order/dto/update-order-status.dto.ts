import { OrderStatus } from '__generated__'
import { IsEnum } from 'class-validator'

export class UpdateOrderStatusDto {
	@IsEnum(OrderStatus)
	status: OrderStatus
}
