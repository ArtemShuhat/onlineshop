'use client'

import {
	useCart,
	useLocalCartStore,
	useRemoveFromServerCart,
	useUpdateToServerItem
} from '@entities/cart'
import { useCheckoutStore } from '@processes/checkout'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@shared/ui/Button'

import { useProfile } from '@entities/user'
import Header from '@widgets/header/Header'

export default function CartPage() {
	const { user } = useProfile()
	const { items, total, isLoading } = useCart()
	const { mutate: updateServer } = useUpdateToServerItem()
	const { mutate: removeServer } = useRemoveFromServerCart()
	const updateLocal = useLocalCartStore(state => state.updateQuantity)
	const removeLocal = useLocalCartStore(state => state.removeItem)
	const router = useRouter()
	const { reset } = useCheckoutStore()

	const handleCheckout = () => {
		if (!user) {
			router.push('/auth/login')
			return
		}
		reset()
		router.push('/checkout')
	}

	const handleUpdateQuantity = (productId: number, newQuantity: number) => {
		if (user) {
			updateServer({ productId, quantity: newQuantity })
		} else {
			updateLocal(productId, newQuantity)
		}
	}

	const handleRemove = (productId: number) => {
		if (user) {
			removeServer(productId)
		} else {
			removeLocal(productId)
		}
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<>
			<Header />
			<div className='container mx-auto max-w-6xl p-6'>
				<h1 className='mb-8 text-3xl font-bold'>Корзина</h1>

				{items.length === 0 ? (
					<div className='py-16 text-center'>
						<ShoppingBag className='mx-auto h-24 w-24 text-gray-300' />
						<h2 className='mt-4 text-xl font-semibold text-gray-700'>
							Корзина пуста
						</h2>
						<p className='mt-2 text-gray-500'>
							Добавьте товары, чтобы оформить заказ
						</p>
						<Link href='/'>
							<Button className='mt-6'>Перейти к покупкам</Button>
						</Link>
					</div>
				) : (
					<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
						<div className='space-y-4 lg:col-span-2'>
							{items.map(item => (
								<div
									key={item.productId}
									className='flex gap-4 rounded-lg bg-white p-4 shadow'
								>
									{item.image && (
										<img
											src={item.image}
											alt={item.name}
											className='h-24 w-24 rounded object-cover'
										/>
									)}

									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>{item.name}</h3>
										<p className='text-gray-600'>${item.price}</p>
										<div className='mt-3 flex items-center gap-2'>
											<Button
												variant='outline'
												size='sm'
												onClick={() =>
													handleUpdateQuantity(
														item.productId,
														item.quantity - 1
													)
												}
												disabled={item.quantity <= 1}
											>
												<Minus className='h-4 w-4' />
											</Button>

											<span className='w-12 text-center font-semibold'>
												{item.quantity}
											</span>

											<Button
												variant='outline'
												size='sm'
												onClick={() =>
													handleUpdateQuantity(
														item.productId,
														item.quantity + 1
													)
												}
											>
												<Plus className='h-4 w-4' />
											</Button>
										</div>
									</div>

									<div className='flex flex-col items-end justify-between'>
										<button
											onClick={() => handleRemove(item.productId)}
											className='text-red-500 hover:text-red-700'
										>
											<Trash2 className='h-5 w-5' />
										</button>

										<p className='text-xl font-bold'>
											${item.price * item.quantity}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className='lg:col-span-1'>
							<div className='sticky top-24 rounded-lg bg-white p-6 shadow'>
								<h2 className='mb-4 text-xl font-semibold'>Итого</h2>

								<div className='mb-4 space-y-2'>
									<div className='flex justify-between'>
										<span>Товары ({items.length}):</span>
										<span>${total}</span>
									</div>
									<div className='flex justify-between'>
										<span>Доставка:</span>
										<span>Бесплатно</span>
									</div>
								</div>

								<div className='mb-6 border-t pt-4'>
									<div className='flex justify-between text-xl font-bold'>
										<span>Всего:</span>
										<span>${total}</span>
									</div>
								</div>

								<Button className='w-full' size='lg' onClick={handleCheckout}>
									Оформить заказ
								</Button>

								<Link href='/'>
									<Button variant='outline' className='mt-3 w-full'>
										Продолжить покупки
									</Button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
