import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateOrderDto {
	@IsNotEmpty()
	@IsString()
	shippingAddress: string

	@IsNotEmpty()
	@IsString()
	shippingCity: string

	@IsOptional()
	@IsString()
	shippingPostalCode?: string

	@IsNotEmpty()
	@IsString()
	phoneNumber: string

	@IsOptional()
	@IsString()
	notes?: string

	@IsNotEmpty()
    @IsIn(['cash', 'card'])
    paymentMethod: 'cash' | 'card' 
}
