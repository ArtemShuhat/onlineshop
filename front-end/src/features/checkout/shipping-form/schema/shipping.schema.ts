import { z } from 'zod'

export const shippingSchema = z.object({
	firstName: z.string().min(2, 'Введите имя'),
	lastName: z.string().min(2, 'Введите фамилию'),
	email: z.string().email('Неверный формат email'),
	shippingAddress: z
		.string()
		.min(5, 'Адрес должен содержать минимум 5 символов'),
	shippingCity: z.string().min(2, 'Введите название города'),
	shippingPostalCode: z
		.string()
		.min(1, 'Почтовый индекс обязателен')
		.regex(/^\d{6}$/, 'Почтовый индекс должен состоять из 6 цифр'),
	phoneNumber: z
		.string()
		.regex(/^\+?[0-9]{10,13}$/, 'Неверный формат номера телефона'),
	notes: z.string().optional()
})

export type ShippingFormData = z.infer<typeof shippingSchema>
