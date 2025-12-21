'use client'

import { useRemoveFromServerCart } from '@entities/cart/api/useServerCart'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@shared/components/ui/popover'
import { ArrowRight, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/shared/ui/Button'

import { useProfile } from '@/entities/api'
import { useLocalCartStore } from '@/entities/cart/model/localCartStore'
import { useCart } from '@/entities/cart/model/useCart'

export function CartDropdown() {
	const [open, setOpen] = useState(false)
	const { user } = useProfile()
	const { items, total } = useCart()
	const { mutate: removeFromServer } = useRemoveFromServerCart()
	const removeFromLocal = useLocalCartStore(state => state.removeItem)

	const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

	const handleRemove = (productId: number) => {
		if (user) {
			removeFromServer(productId)
		} else {
			removeFromLocal(productId)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className='relative flex items-center gap-2 text-black transition-colors hover:text-gray-600'>
					<ShoppingCart className='h-5 w-5' />
					<span>Корзина</span>

					{itemsCount > 0 && (
						<span className='absolute -right-5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
							{itemsCount}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent className='w-96 p-0' align='end' sideOffset={8}>
				<div className='flex items-center justify-between border-b p-4'>
					<h3 className='text-lg font-semibold'>Корзина ({itemsCount})</h3>
					<button
						onClick={() => setOpen(false)}
						className='text-gray-400 transition hover:text-gray-600'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				<div className='max-h-96 overflow-y-auto'>
					{items.length === 0 ? (
						<div className='p-8 text-center text-gray-500'>
							<ShoppingCart className='mx-auto h-12 w-12 text-gray-300' />
							<p className='mt-2'>Корзина пуста</p>
							<p className='mt-1 text-sm'>Добавьте товары для покупки</p>
						</div>
					) : (
						<div className='divide-y'>
							{items.map(item => (
								<div
									key={item.productId}
									className='flex gap-3 p-4 transition hover:bg-gray-50'
								>
									{item.image && (
										<img
											src={item.image}
											alt={item.name}
											className='h-16 w-16 rounded object-cover'
										/>
									)}

									<div className='min-w-0 flex-1'>
										<h4 className='truncate text-sm font-medium'>
											{item.name}
										</h4>
										<p className='text-sm text-gray-500'>
											{item.quantity} шт × ${item.price}
										</p>
										<p className='mt-1 text-sm font-semibold'>
											${item.price * item.quantity}
										</p>
									</div>

									<button
										onClick={() => handleRemove(item.productId)}
										className='text-gray-400 transition hover:text-red-500'
									>
										<X className='h-4 w-4' />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{items.length > 0 && (
					<div className='space-y-3 border-t bg-gray-50 p-4'>
						<div className='flex items-center justify-between text-lg font-semibold'>
							<span>Итого:</span>
							<span>${total}</span>
						</div>

						<Link href='/cart' onClick={() => setOpen(false)}>
							<Button className='w-full'>
								Перейти в корзину
								<ArrowRight className='ml-2 h-4 w-4' />
							</Button>
						</Link>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
