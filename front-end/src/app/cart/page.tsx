'use client'

import {
	useCart,
	useLocalCartStore,
	useRemoveFromServerCart,
	useUpdateToServerItem
} from '@entities/cart'
import { useProfile } from '@entities/user'
import {
	CheckoutStepper,
	ConfirmationStep,
	ShippingStep,
	useCheckoutStore
} from '@processes/checkout'
import { Button } from '@shared/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { Footer } from '@widgets/footer'
import Header from '@widgets/header/Header'
import { SimilarProducts } from '@widgets/similar-products'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const stepMap: { [key: string]: number } = {
	cart: 1,
	'shipping-details': 2,
	confirmation: 3
}

export default function CartPage() {
	const { user } = useProfile()
	const { items, total, isLoading } = useCart()
	const { mutate: updateServer } = useUpdateToServerItem()
	const { mutate: removeServer } = useRemoveFromServerCart()
	const updateLocal = useLocalCartStore(state => state.updateQuantity)
	const removeLocal = useLocalCartStore(state => state.removeItem)
	const router = useRouter()
	const { currentStep, setCurrentStep } = useCheckoutStore()
	const searchParams = useSearchParams()

	const stepParam = searchParams.get('step')

	useEffect(() => {
		if (stepParam && stepMap[stepParam]) {
			setCurrentStep(stepMap[stepParam])
		} else {
			setCurrentStep(1)
		}
	}, [stepParam, setCurrentStep])

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

	const handleNextStep = () => {
		if (!user) {
			router.push('/auth/login')
			return
		}
		router.push('/cart?step=shipping-details')
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<>
			<Header />
			<div className='container mx-auto min-h-[600px] max-w-5xl px-4 py-8'>
				<CheckoutStepper currentStep={currentStep} />

				{currentStep === 1 && (
					<div className='mt-8'>
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
												<Image
													src={item.image}
													alt={item.name}
													width={96}
													height={96}
													className='rounded object-cover'
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

												<p className='text-xl font-semibold'>
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

										<Button
											className='w-full text-base font-semibold'
											size='lg'
											onClick={handleNextStep}
										>
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
				)}

				{currentStep === 2 && <ShippingStep />}

				{currentStep === 3 && <ConfirmationStep />}
			</div>

			{items.length > 0 && (
				<SimilarProducts
					productId={items[0].productId}
					excludeIds={items.map(item => item.productId)}
				/>
			)}

			<Footer />
		</>
	)
}
