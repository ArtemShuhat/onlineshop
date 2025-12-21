import { IsArray } from 'class-validator'

export class MergeCartDto {
	@IsArray()
	items: Array<{
		productId: number
		quantity: number
		name: string
		price: number
		image?: string
	}>
}
