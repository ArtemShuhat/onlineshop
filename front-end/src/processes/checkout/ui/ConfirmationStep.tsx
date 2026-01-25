'use client'

import { useCart } from '@entities/cart'
import { useSubmitOrder } from '@features/checkout'
import { useCheckoutStore } from '@processes/checkout'
import { CheckCircle, MapPin, Package, User } from 'lucide-react'
import Image from 'next/image'

export function ConfirmationStep() {
	const { items, total } = useCart()
	const { mutate: submitOrder, isPending } = useSubmitOrder()
	const { shippingData } = useCheckoutStore()

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-3'>
				<CheckCircle className='h-7 w-7 text-pur' />
				<h2 className='text-2xl font-bold'>Подтверждение заказа</h2>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='mb-3 flex items-center gap-2'>
						<User className='h-5 w-5 text-pur' />
						<h3 className='font-semibold text-lg'>Получатель</h3>
					</div>
					<div className='space-y-2 text-sm text-gray-600'>
						{shippingData?.firstName && (
							<p className='font-medium text-gray-800'>
								{shippingData.firstName} {shippingData.lastName}
							</p>
						)}
						{shippingData?.email && (
							<div className='flex items-center gap-2'>
								<span>{shippingData.email}</span>
							</div>
						)}
						{shippingData?.phoneNumber && (
							<div className='flex items-center gap-2'>
								<span>{shippingData.phoneNumber}</span>
							</div>
						)}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='mb-3 flex items-center gap-2'>
						<MapPin className='h-5 w-5 text-pur' />
						<h3 className='font-semibold text-lg'>Адрес доставки</h3>
					</div>
					<div className='space-y-1 text-sm text-gray-600'>
						<p className='font-medium text-gray-800'>
							{shippingData?.shippingAddress}
						</p>
						<p>
							{shippingData?.shippingCity}
							{shippingData?.shippingPostalCode &&
								`, ${shippingData.shippingPostalCode}`}
						</p>
						{shippingData?.notes && (
							<p className='mt-2 italic text-gray-400'>{shippingData.notes}</p>
						)}
					</div>
				</div>
			</div>

			<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
				<div className='mb-4 flex items-center gap-2'>
					<Package className='h-5 w-5 text-pur' />
					<h3 className='font-semibold text-lg'>Товары ({items.length})</h3>
				</div>
				<div className='max-h-[215px] divide-y overflow-y-auto pr-2'>
					{items.map(item => (
						<div key={item.productId} className='flex items-center gap-4 py-3'>
							{item.image && (
								<Image
									src={item.image}
									alt={item.name}
									width={48}
									height={48}
									className='h-12 w-12 rounded-lg object-cover'
								/>
							)}
							<div className='min-w-0 flex-1'>
								<p className='truncate font-medium'>{item.name}</p>
								<p className='text-sm text-gray-500'>
									{item.quantity} шт. × ${item.price}
								</p>
							</div>
							<span className='whitespace-nowrap font-semibold text-lg'>
								${item.price * item.quantity}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className='rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-gray-500'>Итого к оплате</p>
						<p className='text-3xl font-bold text-pur'>${total}</p>
					</div>
					<button
						onClick={() => submitOrder()}
						disabled={isPending}
						className='mt-5 w-[250px] rounded-xl bg-pur py-4 text-lg font-bold text-white transition hover:bg-purh disabled:cursor-not-allowed disabled:opacity-50'
					>
						{isPending ? 'Оформление...' : 'Подтвердить и оплатить'}
					</button>
				</div>
			</div>
		</div>
	)
}
