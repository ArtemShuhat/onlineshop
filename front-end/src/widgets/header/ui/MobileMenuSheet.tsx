'use client'

import { useCurrencyStore } from '@entities/currency'
import { useProfile } from '@entities/user'
import { LanguageSwitcher } from '@features/language-switcher'
import { useLogoutMutation } from '@features/user'
import { Skeleton } from '@shared/ui'
import { FavoritesDropDown } from '@widgets/favorites-dropdown'
import { useMobileSheetDrag } from '@widgets/header'
import { ChevronDown, Coins, ShoppingCart, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { LuLogOut } from 'react-icons/lu'

const CURRENCY_OPTIONS: Array<{ code: 'USD' | 'EUR' | 'UAH'; symbol: string }> =
	[
		{ code: 'USD', symbol: '$' },
		{ code: 'EUR', symbol: '€' },
		{ code: 'UAH', symbol: '₴' }
	]

const ChevronRight = () => (
	<svg
		className='h-5 w-5'
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M9 5l7 7-7 7'
		/>
	</svg>
)

interface MobileMenuSheetProps {
	isOpen: boolean
	onClose: () => void
}

export function MobileMenuSheet({ isOpen, onClose }: MobileMenuSheetProps) {
	const t = useTranslations('header')
	const tCheckout = useTranslations('checkoutStepper')
	const { currency, setCurrency } = useCurrencyStore()
	const { user, isLoading } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false)

	const { sheetRef, dragHandlers } = useMobileSheetDrag({
		isOpen,
		onClose: () => {
			setMobileCurrencyOpen(false)
			onClose()
		}
	})

	const currencySymbol =
		currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₴'

	const handleClose = () => {
		setMobileCurrencyOpen(false)
		onClose()
	}

	return (
		<div
			className={`fixed inset-0 z-50 hidden max-sm:block ${
				isOpen ? '' : 'pointer-events-none'
			}`}
		>
			<button
				type='button'
				onClick={handleClose}
				aria-label={t('mobile.closeMenuBackdrop')}
				className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0'
				}`}
			/>

			<aside
				ref={sheetRef}
				className={`absolute inset-y-0 left-0 w-[86%] max-w-[360px] rounded-r-[28px] bg-white transition-transform duration-300 ease-out max-xs:inset-x-0 max-xs:bottom-0 max-xs:top-auto max-xs:h-[86dvh] max-xs:w-full max-xs:max-w-none max-xs:rounded-r-none max-xs:rounded-t-[28px] ${
					isOpen
						? 'translate-x-0 max-xs:translate-x-0 max-xs:translate-y-0'
						: '-translate-x-full max-xs:translate-x-0 max-xs:translate-y-full'
				}`}
			>
				<div className='flex h-full flex-col'>
					<div
						className='hidden touch-none items-center justify-center px-4 pb-2 pt-2 max-xs:flex'
						{...dragHandlers}
					>
						<div className='h-1.5 w-12 rounded-full bg-zinc-300' />
					</div>

					<div className='flex items-center justify-between border-b border-zinc-200 p-4 max-xs:hidden'>
						<Link href='/' onClick={handleClose}>
							<Image
								src='/Frame 1.svg'
								alt={t('logoAlt')}
								width={120}
								height={40}
								priority
								className='h-[32px] w-auto'
							/>
						</Link>
						<button
							onClick={handleClose}
							className='rounded-full border border-zinc-200 p-2 text-black transition-colors hover:bg-zinc-100'
							aria-label={t('mobile.closeMenu')}
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<nav className='flex-1 overflow-y-auto p-4'>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/'
									onClick={handleClose}
									className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
								>
									<span>{t('shop')}</span>
									<ChevronRight />
								</Link>
							</li>
							<li>
								<Link
									href='/coming-soon'
									onClick={handleClose}
									className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
								>
									<span>{t('delivery')}</span>
									<ChevronRight />
								</Link>
							</li>
							<li>
								{isLoading ? (
									<Skeleton className='h-11 w-full rounded-lg' />
								) : user ? (
									<Link
										href='/dashboard/settings'
										onClick={handleClose}
										className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
									>
										<div className='flex items-center gap-2'>
											<User className='h-4 w-4' />
											<span>{t('settings')}</span>
										</div>
										<ChevronRight />
									</Link>
								) : null}
							</li>
							<li>
								<Link
									href='/cart'
									onClick={handleClose}
									className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
								>
									<div className='flex items-center gap-2'>
										<ShoppingCart className='h-4 w-4' />
										<span>{tCheckout('cart')}</span>
									</div>
									<ChevronRight />
								</Link>
							</li>
							<li>
								<FavoritesDropDown mobileItem />
							</li>
						</ul>
					</nav>

					<div className='border-t border-zinc-200'>
						<button
							type='button'
							onClick={() => setMobileCurrencyOpen(true)}
							className='flex w-full items-center justify-between px-4 py-3 text-sm text-zinc-800 transition-colors hover:bg-zinc-50'
						>
							<div className='flex items-center gap-2'>
								<Coins className='h-4 w-4' />
								<span>
									{t('mobile.currencyCurrent', {
										currency,
										symbol: currencySymbol
									})}
								</span>
							</div>
							<ChevronDown className='h-4 w-4' />
						</button>
						<div className='flex items-center justify-between px-4 py-3'>
							{user ? (
								<button
									disabled={isLoadingLogout}
									onClick={() => {
										logout()
										handleClose()
									}}
									className='inline-flex h-10 items-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60'
								>
									<LuLogOut className='h-4 w-4' />
									{t('logout')}
								</button>
							) : (
								<Link
									href='/auth/login'
									onClick={handleClose}
									className='inline-flex h-10 items-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800'
								>
									<User className='h-4 w-4' />
									{t('login')}
								</Link>
							)}
							<LanguageSwitcher />
						</div>
					</div>
					<div
						className={`absolute inset-0 z-30 transition-opacity duration-300 ${
							mobileCurrencyOpen
								? 'pointer-events-auto opacity-100'
								: 'pointer-events-none opacity-0'
						}`}
					>
						<div className='absolute inset-0 bg-white/30' />
						<div
							className={`absolute inset-x-0 bottom-0 top-16 rounded-t-[24px] border border-zinc-200 bg-white transition-transform duration-300 ${
								mobileCurrencyOpen ? 'translate-y-0' : 'translate-y-full'
							}`}
						>
							<div className='flex items-center justify-end p-4'>
								<button
									type='button'
									onClick={() => setMobileCurrencyOpen(false)}
									className='text-zinc-700'
									aria-label={t('mobile.closeCurrencyList')}
								>
									<X className='h-6 w-6' />
								</button>
							</div>
							<div className='max-h-[calc(100%-64px)] overflow-y-auto px-4 pb-4'>
								<ul className='space-y-1'>
									{CURRENCY_OPTIONS.map(option => (
										<li key={option.code}>
											<button
												type='button'
												onClick={() => {
													setCurrency(option.code)
													setMobileCurrencyOpen(false)
												}}
												className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
													currency === option.code
														? 'text-zinc-400'
														: 'text-zinc-800 hover:bg-zinc-100'
												}`}
											>
												{`${option.code} ${option.symbol}`}
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	)
}
