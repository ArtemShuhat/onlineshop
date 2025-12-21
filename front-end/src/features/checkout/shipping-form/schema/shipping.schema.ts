import { z } from 'zod'

export const shippingSchema = z.object({
	shippingAddress: z
		.string()
		.min(5, 'Адрес должен содержать минимум 5 символов'),
	shippingCity: z.string().min(2, 'Введите название города'),
	shippingPostalCode: z.string().optional(),
	phoneNumber: z
		.string()
		.regex(/^\+?[0-9]{10,13}$/, 'Неверный формат номера телефона'),
	notes: z.string().optional()
})

export type ShippingFormData = z.infer<typeof shippingSchema>
