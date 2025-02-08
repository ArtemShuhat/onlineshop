import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class LoginDto {
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат Email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@MinLength(6, { message: 'Пароль должен содержать не менее 6 символов.' })
	@IsNotEmpty({ message: 'Поле пароль не может быть пустым.' })
	password: string

	@IsOptional()
	@IsString()
	code: string
}
