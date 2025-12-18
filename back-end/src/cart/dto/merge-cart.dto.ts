import { IsNumber } from 'class-validator'

export class MergeCartDto {
	@IsNumber()
	items: Array<{
		productId: number
		quantity: number
		name: string
		price: number
		image?: string
	}>
}
