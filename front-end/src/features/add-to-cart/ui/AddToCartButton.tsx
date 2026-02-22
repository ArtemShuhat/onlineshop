'use client'

import { useAddToServerCart } from '@entities/cart'
import { useLocalCartStore } from '@entities/cart'
import { ProductImage } from '@entities/product'
import { useProfile } from '@entities/user'
import { getMainProductImage } from '@shared/lib'
import { Button } from '@shared/ui'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
	product: {
		id: number
		name: string
		priceUSD: number
		productImages: ProductImage[]
	}
	quantity?: number
	className?: string
}

export function AddToCartButton({
	product,
	quantity = 1,
	className
}: AddToCartButtonProps) {
	const t = useTranslations('addToCart')
	const { user } = useProfile()
	const { mutate: addToServer, isPending } = useAddToServerCart()
	const addToLocal = useLocalCartStore(state => state.addItem)
	const [isAdding, setIsAdding] = useState(false)

	const handleAddToCart = () => {
		setIsAdding(true)

		if (user) {
			addToServer(
				{ productId: product.id, quantity },
				{
					onSuccess: () => {
						toast.success(t('added', { name: product.name }))
						setIsAdding(false)
					},
					onError: (error: any) => {
						toast.error(error.message || t('addFailed'))
						setIsAdding(false)
					}
				}
			)
		} else {
			try {
				addToLocal({
					productId: product.id,
					name: product.name,
					price: product.priceUSD,
					quantity,
					image: getMainProductImage(product.productImages) || ''
				})
				toast.success(t('added', { name: product.name }))
			} catch (error) {
				toast.error(t('addError'))
			} finally {
				setIsAdding(false)
			}
		}
	}

	return (
		<Button
			onClick={handleAddToCart}
			disabled={isPending || isAdding}
			className={className}
		>
			<ShoppingCart className='mr-2 h-4 w-4' />
			{isPending || isAdding ? t('adding') : t('toCart')}
		</Button>
	)
}
