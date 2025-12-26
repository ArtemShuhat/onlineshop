import {
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches
} from 'class-validator'

export class CreateOrderDto {
	@IsNotEmpty()
	@IsString()
	shippingAddress: string

	@IsNotEmpty()
	@IsString()
	shippingCity: string

	@IsNotEmpty({ message: 'Почтовый индекс обязателен' })
	@IsString()
	@Matches(/^\d{6}$/, {
		message: 'Почтовый индекс должен состоять из 6 цифр'
	})
	shippingPostalCode: string

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
