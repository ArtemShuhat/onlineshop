'use client'

import { ShippingFormData, shippingSchema } from '@features/checkout'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckoutStore } from '@processes/checkout'
import { Mail, MapPin, Phone, User } from 'lucide-react'
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
			<form ref={ref} onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
				<div className='space-y-4'>
					<div className='flex items-center gap-2 text-gray-700'>
						<User className='h-5 w-5 text-pur' />
						<h3 className='font-semibold'>Получатель</h3>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								Имя *
							</label>
							<input
								{...register('firstName')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='Иван'
							/>
							{errors.firstName && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.firstName.message}
								</p>
							)}
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								Фамилия *
							</label>
							<input
								{...register('lastName')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='Иванов'
							/>
							{errors.lastName && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.lastName.message}
								</p>
							)}
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								<span className='flex items-center gap-1.5'>
									<Mail className='h-3.5 w-3.5 text-gray-400' />
									Email *
								</span>
							</label>
							<input
								{...register('email')}
								type='email'
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='example@mail.com'
							/>
							{errors.email && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								<span className='flex items-center gap-1.5'>
									<Phone className='h-3.5 w-3.5 text-gray-400' />
									Телефон *
								</span>
							</label>
							<input
								{...register('phoneNumber')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='+380501234567'
							/>
							{errors.phoneNumber && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.phoneNumber.message}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='flex items-center gap-2 text-gray-700'>
						<MapPin className='h-5 w-5 text-pur' />
						<h3 className='font-semibold'>Адрес доставки</h3>
					</div>

					<div>
						<label className='mb-1.5 block text-sm font-medium text-gray-700'>
							Адрес *
						</label>
						<input
							{...register('shippingAddress')}
							className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
							placeholder='ул. Бридж-стрит, 10'
						/>
						{errors.shippingAddress && (
							<p className='mt-1 text-sm text-red-500'>
								{errors.shippingAddress.message}
							</p>
						)}
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								Город *
							</label>
							<input
								{...register('shippingCity')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='Лондон'
							/>
							{errors.shippingCity && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.shippingCity.message}
								</p>
							)}
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								Почтовый индекс *
							</label>
							<input
								{...register('shippingPostalCode')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder='010101'
								maxLength={6}
							/>
							{errors.shippingPostalCode && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.shippingPostalCode.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label className='mb-1.5 block text-sm font-medium text-gray-700'>
							Примечание к заказу
						</label>
						<textarea
							{...register('notes')}
							className='w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
							rows={3}
							placeholder='Дополнительная информация...'
						/>
					</div>
				</div>
			</form>
		)
	}
)
