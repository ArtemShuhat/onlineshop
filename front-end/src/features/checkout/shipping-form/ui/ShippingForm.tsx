'use client'

import { ShippingFormData, shippingSchema } from '@features/checkout'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckoutStore } from '@processes/checkout'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'

interface ShippingFormProps {
	onSubmit: (data: ShippingFormData) => void
}

export const ShippingForm = forwardRef<HTMLFormElement, ShippingFormProps>(
	function ShippingForm({ onSubmit }, ref) {
		const { shippingData } = useCheckoutStore()

		const {
			register,
			handleSubmit,
			formState: { errors }
		} = useForm<ShippingFormData>({
			resolver: zodResolver(shippingSchema),
			defaultValues: shippingData || {}
		})

		return (
			<form ref={ref} onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div>
					<label className='mb-2 block text-sm font-medium'>
						Адрес доставки *
					</label>
					<input
						{...register('shippingAddress')}
						className='w-full rounded-lg border px-4 py-3'
						placeholder='ул. Бридж-стрит, 10'
					/>
					{errors.shippingAddress && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.shippingAddress.message}
						</p>
					)}
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='mb-2 block text-sm font-medium'>Город *</label>
						<input
							{...register('shippingCity')}
							className='w-full rounded-lg border px-4 py-3'
							placeholder='Лондон'
						/>
						{errors.shippingCity && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.shippingCity.message}
							</p>
						)}
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium'>
							Почтовый индекс *
						</label>
						<input
							{...register('shippingPostalCode')}
							className='w-full rounded-lg border px-4 py-3'
							placeholder='010101'
							maxLength={6}
						/>
						{errors.shippingPostalCode && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.shippingPostalCode.message}
							</p>
						)}
					</div>
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>Телефон *</label>
					<input
						{...register('phoneNumber')}
						className='w-full rounded-lg border px-4 py-3'
						placeholder='+380501234567'
					/>
					{errors.phoneNumber && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.phoneNumber.message}
						</p>
					)}
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>
						Примечание к заказу
					</label>
					<textarea
						{...register('notes')}
						className='w-full rounded-lg border px-4 py-3'
						rows={4}
						placeholder='Дополнительная информация...'
					/>
				</div>
			</form>
		)
	}
)
