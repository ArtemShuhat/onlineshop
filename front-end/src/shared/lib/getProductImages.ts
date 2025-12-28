import { ProductImage } from '@/entities/api/productsApi'

export function getProductImages(productImages?: ProductImage[]): string[] {
	if (!productImages || productImages.length === 0) return []

	const sorted = [...productImages].sort((a, b) => {
		if (a.isMain && !b.isMain) return -1
		if (!a.isMain && b.isMain) return 1
		return 0
	})

	return sorted.map(img => img.url)
}

export function getMainProductImage(
	productImages?: ProductImage[]
): string | null {
	if (!productImages || productImages.length === 0) return null

	const mainImage = productImages.find(img => img.isMain)
	return mainImage?.url || productImages[0]?.url || null
}
