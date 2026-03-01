'use client'

import { useCart } from '@entities/cart'
import { validatePromoCode } from '@entities/promo-code'
import { useProfile } from '@entities/user'
import { useCheckoutStore } from '@processes/checkout'
import { Button } from '@shared/ui'
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronDown, LoaderCircle, Tag, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
	const { user } = useProfile()
	const router = useRouter()

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

	const handleNextStep = () => {
		if (!user) {
			router.push('/auth/login')
			return
		}

		router.push('/cart?step=shipping-details')
	}

	return (
		<div>
			<h2 className='mb-6 text-3xl font-bold tracking-tight'>
				{title ?? t('title')}
			</h2>

			<div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
				<div className='space-y-3'>
					{items.map(item => (
						<div
							key={item.productId}
							className='grid grid-cols-[80px_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm'
						>
							<div className='relative h-20 w-20 overflow-hidden rounded-xl'>
								{item.image && (
									<Image
										src={item.image}
										alt={item.name}
										fill
										className='object-contain p-2'
									/>
								)}
							</div>

							<div className='min-w-0'>
								<h3 className='truncate text-lg font-semibold text-gray-950'>
									{item.name}
								</h3>
								<p className='mt-1 text-base text-gray-500'>${item.price}</p>
							</div>

							<div className='flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1'>
								<button
									onClick={() =>
										updateQuantity(item.productId, item.quantity - 1)
									}
									disabled={item.quantity <= 1}
									className='flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40'
								>
									-
								</button>
								<span className='min-w-8 text-center text-sm font-semibold'>
									{item.quantity}
								</span>
								<button
									onClick={() =>
										updateQuantity(item.productId, item.quantity + 1)
									}
									className='flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-600 transition hover:bg-white'
								>
									+
								</button>
							</div>

							<div className='flex min-w-[120px] items-center justify-end gap-3'>
								<p className='text-xl font-bold text-gray-950'>
									${item.price * item.quantity}
								</p>
								<button
									type='button'
									onClick={() => removeItem(item.productId)}
									aria-label={t('remove')}
									className='inline-flex items-center justify-center rounded-md p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-700'
								>
									<Trash2 className='h-4 w-4' />
								</button>
							</div>
						</div>
					))}
				</div>

				<div className='h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-24'>
					<div className='mb-5'>
						<h3 className='text-lg font-semibold text-gray-950'>
							{t('summaryTitle')}
						</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{t('productsCount', { count: items.length })}
						</p>
					</div>
					<div className='space-y-3'>
						<div className='flex justify-between text-sm text-gray-600'>
							<span>{t('discount')}</span>
							<span className='font-medium text-emerald-600'>
								-${summary.discountAmount}
							</span>
						</div>

						{promoCode && summary.discountAmount > 0 && (
							<div className='flex justify-between text-sm text-gray-600'>
								<span>{t('promoCodeTitle')}</span>
								<span className='font-medium text-gray-950'>{promoCode}</span>
							</div>
						)}

						<div className='border-t border-gray-200 pt-4'>
							<div className='flex items-end justify-between'>
								<span className='text-base font-semibold text-gray-950'>
									{t('totalLabel')}
								</span>
								<span className='text-3xl font-bold tracking-tight text-gray-950'>
									${summary.total}
								</span>
							</div>
						</div>
					</div>
					<div className='mt-5 border-t border-gray-200 pt-4'>
						{isLocal ? (
							<p className='text-sm text-gray-500'>{t('promoCodeLoginHint')}</p>
						) : (
							<div className='space-y-3'>
								<div className='flex items-center gap-2 text-sm text-gray-600'>
									<Tag className='h-4 w-4' />
									<span>{t('promoCodeHint')}</span>
								</div>

								<div className='grid grid-cols-[1fr_42px] gap-2'>
									<input
										value={promoInput}
										onChange={e => {
											setPromoInput(e.target.value.toUpperCase())
											setPromoError(null)
											setPromoSuccess(null)
										}}
										placeholder={t('promoCodePlaceholder')}
										className='w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition'
									/>

									<button
										type='button'
										onClick={handleApplyPromoCode}
										disabled={validateMutation.isPending}
										aria-label={t('applyPromoCode')}
										className='inline-flex items-center justify-center rounded-md border text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
									>
										{validateMutation.isPending ? (
											<LoaderCircle className='h-4 w-4 animate-spin' />
										) : (
											<Check className='h-4 w-4' />
										)}
									</button>
								</div>

								{promoCode && (
									<div className='flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm'>
										<span className='font-medium text-emerald-700'>
											{promoCode}
										</span>
										<button
											type='button'
											onClick={handleClearPromoCode}
											className='text-gray-500 transition hover:text-gray-700'
										>
											{t('clearPromoCode')}
										</button>
									</div>
								)}

								{promoError && (
									<p className='text-sm text-red-600'>{promoError}</p>
								)}
								{promoSuccess && (
									<p className='text-sm text-gray-500'>{promoSuccess}</p>
								)}
							</div>
						)}
					</div>
					{items.length > 0 ? (
						<div className='mt-6 flex flex-col gap-3'>
							<Link href='/' className='w-full'>
								<Button variant='outline' className='w-full'>
									{t('continueShopping')}
								</Button>
							</Link>

							<Button
								className='w-full text-base font-semibold'
								size='lg'
								onClick={handleNextStep}
							>
								{t('checkout')}
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
