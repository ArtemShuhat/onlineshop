'use client'

import { useFavoritesStore } from '@features/favorites'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
	product: {
		id: number
		name: string
		slug: string
		price: number
		image?: string
	}
	className?: string
}

export function FavoriteButton({ product, className }: FavoriteButtonProps) {
	const { toggle, isFavorite } = useFavoritesStore()
	const isActive = isFavorite(product.id)

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		toggle(product)
	}

	return (
		<button
			onClick={handleClick}
			className={`rounded-full p-2 ${
				isActive ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
			} ${className}`}
			aria-label={isActive ? 'Удалить из избранного' : 'Добавить в избранное'}
		>
			<Heart className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
		</button>
	)
}
