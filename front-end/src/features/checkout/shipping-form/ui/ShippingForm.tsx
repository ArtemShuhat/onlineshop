'use client'

import { ShippingFormData, shippingSchema } from '@features/checkout'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckoutStore } from '@processes/checkout'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'

interface ShippingFormProps {
	onSubmit: (data: ShippingFormData) => void
}

export const ShippingForm = forwardRef<HTMLFormElement, ShippingFormProps>(
	function ShippingForm({ onSubmit }, ref) {
		const t = useTranslations('shippingForm')
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
						<h3 className='font-semibold'>{t('recipient')}</h3>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								{t('firstNameLabel')}
							</label>
							<input
								{...register('firstName')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder={t('firstNamePlaceholder')}
							/>
							{errors.firstName && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.firstName.message}
								</p>
							)}
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								{t('lastNameLabel')}
							</label>
							<input
								{...register('lastName')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder={t('lastNamePlaceholder')}
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
									{t('emailLabel')}
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
									{t('phoneLabel')}
								</span>
							</label>
							<input
								{...register('phoneNumber')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder={t('phonePlaceholder')}
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
						<h3 className='font-semibold'>{t('shippingAddressTitle')}</h3>
					</div>

					<div>
						<label className='mb-1.5 block text-sm font-medium text-gray-700'>
							{t('addressLabel')}
						</label>
						<input
							{...register('shippingAddress')}
							className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
							placeholder={t('addressPlaceholder')}
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
								{t('cityLabel')}
							</label>
							<input
								{...register('shippingCity')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder={t('cityPlaceholder')}
							/>
							{errors.shippingCity && (
								<p className='mt-1 text-sm text-red-500'>
									{errors.shippingCity.message}
								</p>
							)}
						</div>

						<div>
							<label className='mb-1.5 block text-sm font-medium text-gray-700'>
								{t('postalCodeLabel')}
							</label>
							<input
								{...register('shippingPostalCode')}
								className='w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
								placeholder={t('postalCodePlaceholder')}
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
							{t('notesLabel')}
						</label>
						<textarea
							{...register('notes')}
							className='w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 transition focus:outline-none'
							rows={3}
							placeholder={t('notesPlaceholder')}
						/>
					</div>
				</div>
			</form>
		)
	}
)
