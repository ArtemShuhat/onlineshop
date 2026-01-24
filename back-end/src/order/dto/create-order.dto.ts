import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

export class CreateOrderDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
	firstName: string

	@IsNotEmpty()
	@IsString()
	@MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
	lastName: string

	@IsNotEmpty()
	@IsEmail({}, { message: 'Некорректный формат email' })
	email: string

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
}
