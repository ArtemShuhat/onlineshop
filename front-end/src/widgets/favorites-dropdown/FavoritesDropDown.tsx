'use client'

import { formatPrice, useCurrencyStore } from '@entities/currency'
import { useFavoritesStore } from '@features/favorites'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui'
import { ChevronRight, Heart, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type FavoritesDropDownProps = {
	mobileItem?: boolean
}

export function FavoritesDropDown({ mobileItem = false }: FavoritesDropDownProps) {
	const t = useTranslations('favoritesDropdown')
	const [open, setOpen] = useState(false)
	const [mounted, setMounted] = useState(false)
	const { products, remove } = useFavoritesStore()
	const { currency } = useCurrencyStore()

	useEffect(() => {
		setMounted(true)
	}, [])

	const itemsCount = products.length

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{mobileItem ? (
					<button className='flex w-full items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'>
						<div className='flex items-center gap-2'>
							<Heart className='h-4 w-4' />
							<span>{t('title')}</span>
						</div>
						{mounted && itemsCount > 0 ? (
							<span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white'>
								{itemsCount > 99 ? '99+' : itemsCount}
							</span>
						) : (
							<ChevronRight className='h-5 w-5 text-zinc-500' />
						)}
					</button>
				) : (
					<button className='relative flex items-center gap-2 text-black transition-colors hover:text-gray-600'>
						<Heart className='h-6 w-6' />
						{mounted && itemsCount > 0 && (
							<span className='absolute -right-[18px] -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
								{itemsCount}
							</span>
						)}
					</button>
				)}
			</PopoverTrigger>

			<PopoverContent
				className={mobileItem ? 'w-[min(22rem,calc(100vw-1.5rem))] p-0' : 'w-96 p-0'}
				align='end'
				sideOffset={mobileItem ? 4 : 8}
			>
				<div className='flex items-center justify-between border-b p-4'>
					<h3 className='text-lg font-semibold'>{t('title')}</h3>
					<button
						onClick={() => setOpen(false)}
						className='text-gray-400 transition hover:text-gray-600'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				<div className='max-h-96 overflow-y-auto'>
					{products.length === 0 ? (
						<div className='p-8 text-center text-gray-500'>
							<Heart className='mx-auto h-12 w-12 text-gray-300' />
							<p className='mt-2'>{t('emptyTitle')}</p>
							<p className='mt-1 text-sm'>{t('emptySubtitle')}</p>
						</div>
					) : (
						<div className='divide-y'>
							{products.map(product => (
								<div
									key={product.id}
									className='flex gap-3 p-4 transition hover:bg-gray-50'
								>
									<Link
										href={`/products/${product.slug}`}
										onClick={() => setOpen(false)}
										className='shrink-0'
									>
										{product.image ? (
											<Image
												src={product.image}
												alt={product.name}
												width={64}
												height={64}
												className='rounded object-cover'
											/>
										) : (
											<div className='flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-400'>
												{t('noPhoto')}
											</div>
										)}
									</Link>

									<div className='min-w-0 flex-1'>
										<Link
											href={`/products/${product.slug}`}
											onClick={() => setOpen(false)}
										>
											<h4 className='truncate text-sm font-medium hover:text-pur'>
												{product.name}
											</h4>
										</Link>
										<p className='mt-1 text-sm font-semibold'>
											{formatPrice(product.price, currency)}
										</p>
									</div>

									<button
										onClick={() => remove(product.id)}
										className='text-gray-400 transition hover:text-red-500'
									>
										<X className='h-4 w-4' />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
