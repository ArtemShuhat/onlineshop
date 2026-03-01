'use client'

import { useCart } from '@entities/cart'
import { validatePromoCode } from '@entities/promo-code'
import { useCheckoutStore } from '@processes/checkout'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { type ReactNode, useEffect, useMemo, useState } from 'react'

interface CartCheckoutContentProps {
	title?: string
	emptyState?: ReactNode
	footer?: ReactNode
}

export function CartCheckoutContent({
	title,
	emptyState,
	footer
}: CartCheckoutContentProps) {
	const t = useTranslations('cartPage')
	const tCommon = useTranslations()

	const { items, total, updateQuantity, removeItem, isLocal } = useCart()
	const {
		promoCode,
		discountPreview,
		setPromoCode,
		setDiscountPreview,
		clearPromoCode
	} = useCheckoutStore()

	const [promoInput, setPromoInput] = useState(promoCode)
	const [promoError, setPromoError] = useState<string | null>(null)
	const [promoSuccess, setPromoSuccess] = useState<string | null>(null)

	const validateMutation = useMutation({
		mutationFn: validatePromoCode
	})

	useEffect(() => {
		if (discountPreview && discountPreview.subtotal !== total) {
			setDiscountPreview(null)
			setPromoSuccess(null)
		}
	}, [discountPreview, total, setDiscountPreview])

	const summary = useMemo(() => {
		if (discountPreview && discountPreview.subtotal === total) {
			return discountPreview
		}

		return {
			promoCode: '',
			subtotal: total,
			discountAmount: 0,
			total
		}
	}, [discountPreview, total])

	if (items.length === 0) {
		return (
			emptyState ?? (
				<div className='py-20 text-center'>
					<p className='text-xl text-gray-500'>{t('emptyTitle')}</p>
				</div>
			)
		)
	}

	const resolveErrorMessage = (error: unknown) => {
		if (!(error instanceof Error)) {
			return t('promoCodeApplyFailed')
		}

		if (error.message.startsWith('errors.')) {
			try {
				return tCommon(error.message)
			} catch {
				return t('promoCodeApplyFailed')
			}
		}

		return error.message || t('promoCodeApplyFailed')
	}

	const handleApplyPromoCode = async () => {
		const normalizedCode = promoInput.trim().toUpperCase()

		if (!normalizedCode) {
			setPromoError(t('enterPromoCode'))
			setPromoSuccess(null)
			return
		}

		try {
			const result = await validateMutation.mutateAsync(normalizedCode)

			setPromoCode(normalizedCode)
			setDiscountPreview(result)
			setPromoError(null)
			setPromoSuccess(t('promoCodeApplied', { code: result.promoCode }))
		} catch (error) {
			setDiscountPreview(null)
			setPromoSuccess(null)
			setPromoError(resolveErrorMessage(error))
		}
	}

	const handleClearPromoCode = () => {
		setPromoInput('')
		clearPromoCode()
		setPromoError(null)
		setPromoSuccess(null)
	}

	return (
		<div>
			<h2 className='mb-6 text-2xl font-bold'>{title ?? t('title')}</h2>

			<div className='space-y-4'>
				{items.map(item => (
					<div
						key={item.productId}
						className='flex items-center gap-4 rounded-lg border bg-white p-4'
					>
						{item.image && (
							<Image
								src={item.image}
								alt={item.name}
								width={80}
								height={80}
								className='rounded object-cover'
							/>
						)}
						<div className='flex-1'>
							<h3 className='font-semibold'>{item.name}</h3>
							<p className='text-gray-600'>${item.price}</p>
						</div>
						<div className='flex items-center gap-2'>
							<button
								onClick={() =>
									updateQuantity(item.productId, item.quantity - 1)
								}
								disabled={item.quantity <= 1}
								className='h-8 w-8 rounded bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200'
							>
								-
							</button>
							<span className='w-8 text-center'>{item.quantity}</span>
							<button
								onClick={() =>
									updateQuantity(item.productId, item.quantity + 1)
								}
								className='h-8 w-8 rounded bg-gray-200 hover:bg-gray-300'
							>
								+
							</button>
						</div>

						<p className='w-24 text-right font-bold'>
							${item.price * item.quantity}
						</p>
						<button
							onClick={() => removeItem(item.productId)}
							className='text-red-600 hover:text-red-800'
						>
							{t('remove')}
						</button>
					</div>
				))}
			</div>

			<div className='mt-6 grid gap-4 lg:grid-cols-[1fr_320px]'>
				<div className='rounded-lg border bg-white p-6'>
					<h3 className='mb-3 text-lg font-semibold'>{t('promoCodeTitle')}</h3>

					{isLocal ? (
						<p className='text-sm text-gray-500'>{t('promoCodeLoginHint')}</p>
					) : (
						<>
							<div className='flex gap-3'>
								<input
									value={promoInput}
									onChange={e => {
										setPromoInput(e.target.value.toUpperCase())
										setPromoError(null)
										setPromoSuccess(null)
									}}
									placeholder={t('promoCodePlaceholder')}
									className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:outline-none'
								/>
								<button
									type='button'
									onClick={handleApplyPromoCode}
									disabled={validateMutation.isPending}
									className='rounded-md bg-pur px-4 py-2 font-medium text-white transition hover:bg-purh disabled:cursor-not-allowed disabled:opacity-50'
								>
									{validateMutation.isPending
										? t('applyingPromoCode')
										: t('applyPromoCode')}
								</button>
								{promoCode && (
									<button
										type='button'
										onClick={handleClearPromoCode}
										className='rounded-md border px-4 py-2 text-sm'
									>
										{t('clearPromoCode')}
									</button>
								)}
							</div>

							{promoError && (
								<p className='mt-3 text-sm text-red-600'>{promoError}</p>
							)}

							{promoSuccess && (
								<p className='mt-3 text-sm text-green-600'>{promoSuccess}</p>
							)}
						</>
					)}
				</div>

				<div className='rounded-lg bg-gray-50 p-6'>
					<div className='space-y-3'>
						<div className='flex justify-between text-sm text-gray-600'>
							<span>{t('subtotal')}</span>
							<span>${summary.subtotal}</span>
						</div>

						<div className='flex justify-between text-sm text-gray-600'>
							<span>{t('discount')}</span>
							<span className='text-green-600'>-${summary.discountAmount}</span>
						</div>

						<div className='border-t pt-3'>
							<div className='flex justify-between text-xl font-semibold'>
								<span>{t('totalLabel')}</span>
								<span>${summary.total}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{footer && <div className='mt-6'>{footer}</div>}
		</div>
	)
}
