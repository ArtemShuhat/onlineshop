'use client'

import {
	createPromoCode,
	getAdminPromoCodes,
	updatePromoCodeStatus
} from '@entities/promo-code'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function AdminPromoCodesSection() {
	const t = useTranslations('adminPromoCodes')
	const tCommon = useTranslations()
	const queryClient = useQueryClient()

	const [code, setCode] = useState('')
	const [percentOff, setPercentOff] = useState('10')
	const [minOrderAmount, setMinOrderAmount] = useState('')
	const [maxUses, setMaxUses] = useState('')
	const [expiresAt, setExpiresAt] = useState('')

	const { data: promoCodes = [], isLoading } = useQuery({
		queryKey: ['promo-codes'],
		queryFn: getAdminPromoCodes
	})

	const createMutation = useMutation({
		mutationFn: createPromoCode,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['promo-codes'] })
			setCode('')
			setPercentOff('10')
			setMinOrderAmount('')
			setMaxUses('')
			setExpiresAt('')
		}
	})

	const toggleMutation = useMutation({
		mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
			updatePromoCodeStatus(id, isActive),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['promo-codes'] })
		}
	})

	const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		createMutation.mutate({
			code: code.trim() || undefined,
			percentOff: Number(percentOff),
			minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
			maxUses: maxUses ? Number(maxUses) : undefined,
			expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined
		})
	}

	const getErrorMessage = (error: unknown) => {
		if (!(error instanceof Error)) {
			return t('createFailed')
		}

		if (error.message.startsWith('errors.')) {
			try {
				return tCommon(error.message)
			} catch {
				return t('createFailed')
			}
		}

		return error.message || t('createFailed')
	}

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold text-gray-900'>{t('title')}</h2>
				<p className='mt-1 text-sm text-gray-600'>{t('description')}</p>
			</div>

			<form
				onSubmit={handleCreate}
				className='grid gap-4 rounded-lg border bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5'
			>
				<input
					value={code}
					onChange={e => setCode(e.target.value.toUpperCase())}
					placeholder={t('fields.codePlaceholder')}
					className='rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pur'
				/>

				<input
					type='number'
					min='1'
					max='100'
					value={percentOff}
					onChange={e => setPercentOff(e.target.value)}
					placeholder={t('fields.percentOffPlaceholder')}
					className='rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pur'
				/>

				<input
					type='number'
					min='0'
					value={minOrderAmount}
					onChange={e => setMinOrderAmount(e.target.value)}
					placeholder={t('fields.minOrderAmountPlaceholder')}
					className='rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pur'
				/>

				<input
					type='number'
					min='1'
					value={maxUses}
					onChange={e => setMaxUses(e.target.value)}
					placeholder={t('fields.maxUsesPlaceholder')}
					className='rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pur'
				/>

				<input
					type='datetime-local'
					value={expiresAt}
					onChange={e => setExpiresAt(e.target.value)}
					className='rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-pur'
				/>

				<div className='md:col-span-2 xl:col-span-5'>
					<button
						type='submit'
						disabled={createMutation.isPending}
						className='rounded-md bg-pur px-4 py-2 font-medium text-white transition hover:bg-purh disabled:cursor-not-allowed disabled:opacity-50'
					>
						{createMutation.isPending ? t('creating') : t('create')}
					</button>
				</div>

				{createMutation.error && (
					<p className='text-sm text-red-600 md:col-span-2 xl:col-span-5'>
						{getErrorMessage(createMutation.error)}
					</p>
				)}
			</form>

			<div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
				{isLoading ? (
					<div className='p-6 text-sm text-gray-500'>{t('loading')}</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full text-sm'>
							<thead className='bg-gray-50 text-left text-gray-600'>
								<tr>
									<th className='px-4 py-3'>{t('table.code')}</th>
									<th className='px-4 py-3'>{t('table.discount')}</th>
									<th className='px-4 py-3'>{t('table.used')}</th>
									<th className='px-4 py-3'>{t('table.minOrder')}</th>
									<th className='px-4 py-3'>{t('table.expiresAt')}</th>
									<th className='px-4 py-3'>{t('table.status')}</th>
									<th className='px-4 py-3'>{t('table.action')}</th>
								</tr>
							</thead>
							<tbody>
								{promoCodes.map(item => (
									<tr key={item.id} className='border-t'>
										<td className='px-4 py-3 font-medium'>{item.code}</td>
										<td className='px-4 py-3'>{item.percentOff}%</td>
										<td className='px-4 py-3'>
											{item.usedCount}
											{item.maxUses ? ` / ${item.maxUses}` : ''}
										</td>
										<td className='px-4 py-3'>
											{item.minOrderAmount
												? `$${item.minOrderAmount}`
												: t('table.no')}
										</td>
										<td className='px-4 py-3'>
											{item.expiresAt
												? new Date(item.expiresAt).toLocaleString()
												: t('table.noExpiry')}
										</td>
										<td className='px-4 py-3'>
											<span
												className={
													item.isActive ? 'text-green-600' : 'text-red-600'
												}
											>
												{item.isActive
													? t('table.active')
													: t('table.inactive')}
											</span>
										</td>
										<td className='px-4 py-3'>
											<button
												type='button'
												onClick={() =>
													toggleMutation.mutate({
														id: item.id,
														isActive: !item.isActive
													})
												}
												className='rounded-md border px-3 py-1.5 text-xs transition hover:bg-gray-50'
											>
												{item.isActive ? t('table.disable') : t('table.enable')}
											</button>
										</td>
									</tr>
								))}

								{promoCodes.length === 0 && (
									<tr>
										<td
											colSpan={7}
											className='px-4 py-8 text-center text-gray-500'
										>
											{t('empty')}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
