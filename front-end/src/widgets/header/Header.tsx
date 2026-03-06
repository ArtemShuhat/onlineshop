'use client'

import { getTopProducts } from '@entities/analytics'
import { useCurrencyStore } from '@entities/currency'
import { usePendingOrders } from '@entities/order'
import { getProducts, searchProducts } from '@entities/product'
import { useProfile } from '@entities/user'
import { LanguageSwitcher } from '@features/language-switcher'
import { useLogoutMutation } from '@features/user'
import { useDebounce, useScrollRevealHeader } from '@shared/hooks'
import { useScrollHeader } from '@shared/hooks/useScrollHeader'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Skeleton
} from '@shared/ui'
import { useQuery } from '@tanstack/react-query'
import { CartDropdown } from '@widgets/cart-dropdown'
import { FavoritesDropDown } from '@widgets/favorites-dropdown'
import { SearchBar } from '@widgets/search'
import {
	ChevronDown,
	Coins,
	Menu,
	ScrollText,
	Search,
	ShoppingCart,
	User,
	X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { LuLogOut, LuSettings, LuShield } from 'react-icons/lu'

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

const SHEET_CLOSE_DRAG_THRESHOLD = 90

type MobileSearchSuggestion = {
	id: number
	name: string
	slug: string
}

export default function Header() {
	const router = useRouter()
	const t = useTranslations('header')
	const tSearch = useTranslations('searchBar')
	const tCheckout = useTranslations('checkoutStepper')
	const { currency, setCurrency } = useCurrencyStore()
	const { user, isLoading } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
	const [mobileSearchQuery, setMobileSearchQuery] = useState('')
	const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false)
	const mobileMenuSheetRef = useRef<HTMLElement | null>(null)
	const mobileMenuDragStartY = useRef<number | null>(null)
	const mobileMenuDragDistance = useRef(0)
	const mobileMenuDragRaf = useRef<number | null>(null)
	const mobileMenuActivePointerId = useRef<number | null>(null)
	const mobileMenuLockedScrollY = useRef(0)
	const mobileMenuBodyStyleSnapshot = useRef<{
		overflow: string
		position: string
		top: string
		width: string
	}>({
		overflow: '',
		position: '',
		top: '',
		width: ''
	})
	const mobileSearchSheetRef = useRef<HTMLElement | null>(null)
	const mobileSearchDragStartY = useRef<number | null>(null)
	const mobileSearchDragDistance = useRef(0)
	const mobileSearchDragRaf = useRef<number | null>(null)
	const mobileSearchActivePointerId = useRef<number | null>(null)
	const [mobileRecommendations, setMobileRecommendations] = useState<
		MobileSearchSuggestion[]
	>([])
	const [isLoadingMobileRecommendations, setIsLoadingMobileRecommendations] =
		useState(false)
	const { data: pendingData } = usePendingOrders()
	const pendingCount = pendingData?.count || 0
	const currencySymbol =
		currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : '\u20B4'
	const currencyOptions: Array<{
		code: 'USD' | 'EUR' | 'UAH'
		symbol: string
	}> = [
		{ code: 'USD', symbol: '$' },
		{ code: 'EUR', symbol: '\u20AC' },
		{ code: 'UAH', symbol: '\u20B4' }
	]
	const debouncedMobileSearchQuery = useDebounce(mobileSearchQuery.trim(), 300)

	const clearMenuSheetInlineStyles = () => {
		const sheet = mobileMenuSheetRef.current

		if (!sheet) {
			return
		}

		sheet.style.transition = ''
		sheet.style.transform = ''
	}

	const clearSearchSheetInlineStyles = () => {
		const sheet = mobileSearchSheetRef.current

		if (!sheet) {
			return
		}

		sheet.style.transition = ''
		sheet.style.transform = ''
	}

	const cancelMenuDragRaf = () => {
		if (mobileMenuDragRaf.current === null) {
			return
		}

		cancelAnimationFrame(mobileMenuDragRaf.current)
		mobileMenuDragRaf.current = null
	}

	const cancelSearchDragRaf = () => {
		if (mobileSearchDragRaf.current === null) {
			return
		}

		cancelAnimationFrame(mobileSearchDragRaf.current)
		mobileSearchDragRaf.current = null
	}

	const { translateY, progress, prefersReducedMotion } = useScrollHeader({
		initialOffset: 55,
		scrollDistance: 80,
		respectMotionPreference: true
	})

	const { data: mobileSearchData, isLoading: isLoadingSearchResults } =
		useQuery({
			queryKey: ['mobile-header-search', debouncedMobileSearchQuery],
			queryFn: () =>
				searchProducts({
					q: debouncedMobileSearchQuery,
					limit: 8
				}),
			enabled: mobileSearchOpen && debouncedMobileSearchQuery.length >= 2
		})

	useEffect(() => {
		if (!mobileMenuOpen) {
			setMobileCurrencyOpen(false)
			mobileMenuDragStartY.current = null
			mobileMenuDragDistance.current = 0
		}

		mobileMenuActivePointerId.current = null
		cancelMenuDragRaf()
		clearMenuSheetInlineStyles()
	}, [mobileMenuOpen])

	useEffect(() => {
		if (!mobileSearchOpen) {
			mobileSearchDragStartY.current = null
			mobileSearchDragDistance.current = 0
		}

		mobileSearchActivePointerId.current = null
		cancelSearchDragRaf()
		clearSearchSheetInlineStyles()
	}, [mobileSearchOpen])

	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		const isMobileSheetOpen = mobileMenuOpen || mobileSearchOpen

		if (!isMobileSheetOpen) {
			return
		}

		const body = document.body
		mobileMenuLockedScrollY.current = window.scrollY
		mobileMenuBodyStyleSnapshot.current = {
			overflow: body.style.overflow,
			position: body.style.position,
			top: body.style.top,
			width: body.style.width
		}

		body.style.overflow = 'hidden'
		body.style.position = 'fixed'
		body.style.top = `-${mobileMenuLockedScrollY.current}px`
		body.style.width = '100%'

		return () => {
			const snapshot = mobileMenuBodyStyleSnapshot.current
			body.style.overflow = snapshot.overflow
			body.style.position = snapshot.position
			body.style.top = snapshot.top
			body.style.width = snapshot.width
			window.scrollTo({ top: mobileMenuLockedScrollY.current })
		}
	}, [mobileMenuOpen, mobileSearchOpen])

	useEffect(() => {
		return () => {
			cancelMenuDragRaf()
			cancelSearchDragRaf()
		}
	}, [])

	useEffect(() => {
		if (!mobileSearchOpen) {
			return
		}

		let active = true

		const loadRecommendations = async () => {
			setIsLoadingMobileRecommendations(true)

			try {
				let suggestions: MobileSearchSuggestion[] = []

				try {
					const topViewedProducts = await getTopProducts('views', 8)
					suggestions = topViewedProducts.map(product => ({
						id: product.id,
						name: product.name,
						slug: product.slug
					}))
				} catch {
					suggestions = []
				}

				if (!suggestions.length) {
					try {
						const products = await getProducts()
						suggestions = products
							.filter(product => product.isVisible)
							.sort((a, b) => a.name.localeCompare(b.name))
							.slice(0, 12)
							.map(product => ({
								id: product.id,
								name: product.name,
								slug: product.slug
							}))
					} catch {
						suggestions = []
					}
				}

				if (active) {
					setMobileRecommendations(suggestions)
				}
			} finally {
				if (active) {
					setIsLoadingMobileRecommendations(false)
				}
			}
		}

		void loadRecommendations()

		return () => {
			active = false
		}
	}, [mobileSearchOpen])

	useEffect(() => {
		if (!mobileSearchOpen) {
			setMobileSearchQuery('')
		}
	}, [mobileSearchOpen])

	const { translate } = useScrollRevealHeader({
		hiddenOffset: 0,
		revealThreshold: 800
	})

	const mobileSearchSuggestions =
		debouncedMobileSearchQuery.length >= 2
			? (mobileSearchData?.hits ?? []).map(hit => ({
					id: hit.id,
					name: hit.name,
					slug: hit.slug
				}))
			: mobileRecommendations
	const mobileSearchQueryTrimmed = mobileSearchQuery.trim()

	const showMobileSearchLoading =
		debouncedMobileSearchQuery.length >= 2
			? isLoadingSearchResults
			: isLoadingMobileRecommendations

	const handleMobileSearchSubmit = () => {
		if (mobileSearchQueryTrimmed.length < 2) {
			return
		}
		router.push(`/search?q=${encodeURIComponent(mobileSearchQueryTrimmed)}`)
		setMobileSearchOpen(false)
	}

	const scheduleMenuSheetDragRender = () => {
		if (mobileMenuDragRaf.current !== null) {
			return
		}

		mobileMenuDragRaf.current = requestAnimationFrame(() => {
			mobileMenuDragRaf.current = null
			const sheet = mobileMenuSheetRef.current

			if (!sheet) {
				return
			}

			sheet.style.transition = 'none'
			sheet.style.transform = `translate3d(0, ${mobileMenuDragDistance.current}px, 0)`
		})
	}

	const scheduleSearchSheetDragRender = () => {
		if (mobileSearchDragRaf.current !== null) {
			return
		}

		mobileSearchDragRaf.current = requestAnimationFrame(() => {
			mobileSearchDragRaf.current = null
			const sheet = mobileSearchSheetRef.current

			if (!sheet) {
				return
			}

			sheet.style.transition = 'none'
			sheet.style.transform = `translate3d(0, ${mobileSearchDragDistance.current}px, 0)`
		})
	}

	const animateMenuSheetTo = (transformValue: string) => {
		const sheet = mobileMenuSheetRef.current

		if (!sheet) {
			return
		}

		sheet.style.transition = 'transform 220ms ease-out'
		sheet.style.transform = transformValue

		const clearInlineTransform = () => {
			sheet.style.transition = ''
			sheet.style.transform = ''
		}

		sheet.addEventListener('transitionend', clearInlineTransform, {
			once: true
		})
	}

	const animateSearchSheetTo = (transformValue: string) => {
		const sheet = mobileSearchSheetRef.current

		if (!sheet) {
			return
		}

		sheet.style.transition = 'transform 220ms ease-out'
		sheet.style.transform = transformValue

		const clearInlineTransform = () => {
			sheet.style.transition = ''
			sheet.style.transform = ''
		}

		sheet.addEventListener('transitionend', clearInlineTransform, {
			once: true
		})
	}

	const handleMobileMenuDragStart = (event: PointerEvent<HTMLDivElement>) => {
		mobileMenuDragStartY.current = event.clientY
		mobileMenuDragDistance.current = 0
		mobileMenuActivePointerId.current = event.pointerId
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const handleMobileMenuDragMove = (event: PointerEvent<HTMLDivElement>) => {
		if (
			mobileMenuDragStartY.current === null ||
			mobileMenuActivePointerId.current !== event.pointerId
		) {
			return
		}

		mobileMenuDragDistance.current = Math.max(
			0,
			event.clientY - mobileMenuDragStartY.current
		)
		scheduleMenuSheetDragRender()
	}

	const handleMobileMenuDragEnd = (event: PointerEvent<HTMLDivElement>) => {
		if (mobileMenuActivePointerId.current !== event.pointerId) {
			return
		}

		if (mobileMenuDragStartY.current === null) {
			mobileMenuActivePointerId.current = null
			return
		}

		const shouldClose =
			mobileMenuDragDistance.current > SHEET_CLOSE_DRAG_THRESHOLD

		if (shouldClose) {
			animateMenuSheetTo('translate3d(0, 100%, 0)')
			setMobileMenuOpen(false)
		} else {
			animateMenuSheetTo('translate3d(0, 0, 0)')
		}

		mobileMenuDragDistance.current = 0
		mobileMenuDragStartY.current = null
		mobileMenuActivePointerId.current = null
	}

	const handleMobileSearchDragStart = (event: PointerEvent<HTMLDivElement>) => {
		mobileSearchDragStartY.current = event.clientY
		mobileSearchDragDistance.current = 0
		mobileSearchActivePointerId.current = event.pointerId
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const handleMobileSearchDragMove = (event: PointerEvent<HTMLDivElement>) => {
		if (
			mobileSearchDragStartY.current === null ||
			mobileSearchActivePointerId.current !== event.pointerId
		) {
			return
		}

		mobileSearchDragDistance.current = Math.max(
			0,
			event.clientY - mobileSearchDragStartY.current
		)
		scheduleSearchSheetDragRender()
	}

	const handleMobileSearchDragEnd = (event: PointerEvent<HTMLDivElement>) => {
		if (mobileSearchActivePointerId.current !== event.pointerId) {
			return
		}

		if (mobileSearchDragStartY.current === null) {
			mobileSearchActivePointerId.current = null
			return
		}

		const shouldClose =
			mobileSearchDragDistance.current > SHEET_CLOSE_DRAG_THRESHOLD

		if (shouldClose) {
			animateSearchSheetTo('translate3d(0, 100%, 0)')
			setMobileSearchOpen(false)
		} else {
			animateSearchSheetTo('translate3d(0, 0, 0)')
		}

		mobileSearchDragDistance.current = 0
		mobileSearchDragStartY.current = null
		mobileSearchActivePointerId.current = null
	}

	return (
		<>
			<div
				className='flex h-[85px] w-full justify-center bg-pur pt-[18px] text-sm text-white'
				style={{ position: 'relative', zIndex: 20 }}
				aria-hidden='true'
			>
				<h1>{t('notice')}</h1>
			</div>

			<header className='group sticky top-0 z-50 mt-[-27px] w-full'>
				<div
					className='pointer-events-none absolute left-0 right-0 top-0 z-20 h-8 bg-white'
					style={{
						opacity: progress,
						transform: `translateY(${(1 - progress) * 100}%)`,
						transformOrigin: 'top',
						willChange:
							progress < 1 && !prefersReducedMotion
								? 'opacity, transform'
								: 'auto'
					}}
					aria-hidden='true'
				/>
				<div
					className='relative z-20 w-full items-center bg-white'
					style={{
						borderTopLeftRadius: '26px',
						borderTopRightRadius: '26px',
						borderBottomLeftRadius: '0',
						borderBottomRightRadius: '0',
						overflow: 'hidden'
					}}
				>
					<div className='mx-auto flex h-[100px] max-w-[1280px] items-center justify-between px-4 py-4 text-lg font-bold max-sm:h-auto max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:py-3'>
						<Link href='/' className='max-sm:hidden'>
							<Image
								src='/Frame 1.svg'
								alt={t('logoAlt')}
								width={130}
								height={40}
								priority
								className='h-[55px] w-auto max-sm:h-[35px] max-md:h-[45px]'
							/>
						</Link>
						<nav className='mx-10 flex-1 max-sm:hidden'>
							<ul className='flex items-center justify-evenly'>
								<li>
									<Link href='/'>
										<span className='text-black transition-colors hover:text-gray-600'>
											{t('shop')}
										</span>
									</Link>
								</li>
								<li>
									<Link href='/coming-soon'>
										<span className='text-black transition-colors hover:text-gray-600'>
											{t('delivery')}
										</span>
									</Link>
								</li>
								<li>
									<SearchBar />
								</li>
								<div className='flex items-center gap-9 max-md:gap-6'>
									{/* <li>
										<LanguageSwitcher />
									</li> */}
									<li>
										<CartDropdown />
									</li>
									<li>
										<FavoritesDropDown />
									</li>

									<li>
										{isLoading ? (
											<Skeleton className='h-[28px] w-20 rounded-full' />
										) : user ? (
											<DropdownMenu>
												<DropdownMenuTrigger className='flex items-center gap-2 transition-colors hover:text-gray-600'>
													<div className='relative'>
														<Avatar className='h-8 w-8'>
															<AvatarImage src={user.picture} />
															<AvatarFallback>
																{user.displayName.slice(0, 1).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														{pendingCount > 0 && (
															<span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
																{pendingCount > 9 ? '9+' : pendingCount}
															</span>
														)}
													</div>
													<span className='text-base'>{user.displayName}</span>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className='w-48 font-bold'
													align='end'
												>
													<DropdownMenuItem asChild>
														<Link
															href='/dashboard/settings'
															className='flex w-full cursor-pointer items-center'
														>
															<LuSettings className='mr-2 size-4' />
															<p>{t('settings')}</p>
														</Link>
													</DropdownMenuItem>
													{user.role === 'ADMIN' && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem asChild>
																<Link
																	href='/dashboard/admin'
																	className='flex w-full cursor-pointer items-center'
																>
																	<LuShield className='mr-2 size-4' />
																	<p>{t('adminPanel')}</p>
																</Link>
															</DropdownMenuItem>
														</>
													)}
													{user.role === 'REGULAR' && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem asChild>
																<Link
																	href='/orders'
																	className='flex w-full cursor-pointer items-center'
																>
																	<div className='relative mr-2'>
																		<ScrollText className='size-4' />
																		{pendingCount > 0 && (
																			<span className='absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500' />
																		)}
																	</div>
																	<p>{t('orders')}</p>
																	{pendingCount > 0 && (
																		<span className='ml-auto text-xs text-red-500'>
																			{pendingCount}
																		</span>
																	)}
																</Link>
															</DropdownMenuItem>
														</>
													)}
													<DropdownMenuItem
														disabled={isLoadingLogout}
														onClick={() => logout()}
														className='cursor-pointer'
													>
														<LuLogOut className='mr-2 size-4' />
														{t('logout')}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										) : (
											<Link href='/auth/login'>
												<span className='flex text-black transition-colors hover:text-gray-600'>
													<User className='mr-2 h-6 w-6' />
												</span>
											</Link>
										)}
									</li>
								</div>
							</ul>
						</nav>
						<div className='relative hidden items-center justify-between max-sm:flex'>
							<button
								onClick={() => {
									setMobileSearchOpen(false)
									setMobileMenuOpen(!mobileMenuOpen)
								}}
								className='rounded-md p-1 text-black transition-colors hover:bg-gray-100'
								aria-label={t('mobile.toggleMenu')}
							>
								{mobileMenuOpen ? (
									<X className='h-6 w-6' />
								) : (
									<Menu className='h-6 w-6' />
								)}
							</button>

							<Link href='/' className='absolute left-1/2 -translate-x-1/2'>
								<Image
									src='/Frame 1.svg'
									alt={t('logoAlt')}
									width={130}
									height={40}
									priority
									className='h-[34px] w-auto max-sm:h-[40px]'
								/>
							</Link>

							<div className='ml-auto flex items-center gap-3'>
								<button
									type='button'
									onClick={() => {
										setMobileMenuOpen(false)
										setMobileCurrencyOpen(false)
										setMobileSearchOpen(true)
									}}
									className='rounded-md p-1 text-black transition-colors hover:bg-gray-100'
									aria-label={t('mobile.openSearch')}
								>
									<Search className='h-5 w-5' />
								</button>
								<CartDropdown />
							</div>
						</div>
					</div>
				</div>
				<div
					className={`fixed inset-0 z-50 hidden max-sm:block ${
						mobileMenuOpen ? '' : 'pointer-events-none'
					}`}
				>
					<button
						type='button'
						onClick={() => setMobileMenuOpen(false)}
						aria-label={t('mobile.closeMenuBackdrop')}
						className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
							mobileMenuOpen ? 'opacity-100' : 'opacity-0'
						}`}
					/>

					<aside
						ref={mobileMenuSheetRef}
						className={`absolute inset-y-0 left-0 w-[86%] max-w-[360px] rounded-r-[28px] bg-white transition-transform duration-300 ease-out max-xs:inset-x-0 max-xs:bottom-0 max-xs:top-auto max-xs:h-[86dvh] max-xs:w-full max-xs:max-w-none max-xs:rounded-r-none max-xs:rounded-t-[28px] ${
							mobileMenuOpen
								? 'translate-x-0 max-xs:translate-x-0 max-xs:translate-y-0'
								: '-translate-x-full max-xs:translate-x-0 max-xs:translate-y-full'
						}`}
					>
						<div className='flex h-full flex-col'>
							<div
								className='hidden touch-none items-center justify-center px-4 pb-2 pt-2 max-xs:flex'
								onPointerDown={handleMobileMenuDragStart}
								onPointerMove={handleMobileMenuDragMove}
								onPointerUp={handleMobileMenuDragEnd}
								onPointerCancel={handleMobileMenuDragEnd}
								onLostPointerCapture={handleMobileMenuDragEnd}
							>
								<div className='h-1.5 w-12 rounded-full bg-zinc-300' />
							</div>
							<div className='flex items-center justify-between border-b border-zinc-200 p-4 max-xs:hidden'>
								<Link href='/' onClick={() => setMobileMenuOpen(false)}>
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
									onClick={() => setMobileMenuOpen(false)}
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
											onClick={() => setMobileMenuOpen(false)}
											className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
										>
											<span>{t('shop')}</span>
											<ChevronRight />
										</Link>
									</li>

									<li>
										<Link
											href='/coming-soon'
											onClick={() => setMobileMenuOpen(false)}
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
												onClick={() => setMobileMenuOpen(false)}
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
											onClick={() => setMobileMenuOpen(false)}
											className='flex items-center justify-between rounded-lg px-2 py-3 text-black transition-colors hover:bg-zinc-50'
										>
											<div className='flex items-center gap-2'>
												<ShoppingCart className='h-4 w-4' />
												<span>{tCheckout('cart')}</span>
											</div>
											<ChevronRight />
										</Link>
									</li>
									<li className='hidden rounded-lg px-2 py-3'>
										<div className='mb-2 text-black'>Валюта</div>
										<div className='flex gap-2'>
											<button
												type='button'
												onClick={() => setCurrency('USD')}
												className={`rounded-md border px-3 py-1.5 text-sm ${
													currency === 'USD'
														? 'border-black bg-black text-white'
														: 'border-zinc-300 text-black hover:bg-zinc-100'
												}`}
											>
												USD $
											</button>
											<button
												type='button'
												onClick={() => setCurrency('EUR')}
												className={`rounded-md border px-3 py-1.5 text-sm ${
													currency === 'EUR'
														? 'border-black bg-black text-white'
														: 'border-zinc-300 text-black hover:bg-zinc-100'
												}`}
											>
												EUR €
											</button>
											<button
												type='button'
												onClick={() => setCurrency('UAH')}
												className={`rounded-md border px-3 py-1.5 text-sm ${
													currency === 'UAH'
														? 'border-black bg-black text-white'
														: 'border-zinc-300 text-black hover:bg-zinc-100'
												}`}
											>
												UAH ₴
											</button>
										</div>
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
												setMobileMenuOpen(false)
											}}
											className='inline-flex h-10 items-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60'
										>
											<LuLogOut className='h-4 w-4' />
											{t('logout')}
										</button>
									) : (
										<Link
											href='/auth/login'
											onClick={() => setMobileMenuOpen(false)}
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
											{currencyOptions.map(option => (
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

				<div
					className={`fixed inset-0 z-[60] hidden max-sm:block ${
						mobileSearchOpen ? '' : 'pointer-events-none'
					}`}
				>
					<button
						type='button'
						onClick={() => setMobileSearchOpen(false)}
						aria-label={t('mobile.closeSearchBackdrop')}
						className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
							mobileSearchOpen ? 'opacity-100' : 'opacity-0'
						}`}
					/>

					<aside
						ref={mobileSearchSheetRef}
						className={`absolute inset-y-0 right-0 w-[86%] max-w-[420px] rounded-l-[28px] bg-white transition-transform duration-300 ease-out max-xs:inset-x-0 max-xs:bottom-0 max-xs:top-auto max-xs:h-[86dvh] max-xs:w-full max-xs:max-w-none max-xs:rounded-l-none max-xs:rounded-t-[28px] ${
							mobileSearchOpen
								? 'translate-x-0 max-xs:translate-x-0 max-xs:translate-y-0'
								: 'translate-x-full max-xs:translate-x-0 max-xs:translate-y-full'
						}`}
					>
						<div className='flex h-full flex-col'>
							<div
								className='hidden touch-none items-center justify-center px-4 pb-2 pt-2 max-xs:flex'
								onPointerDown={handleMobileSearchDragStart}
								onPointerMove={handleMobileSearchDragMove}
								onPointerUp={handleMobileSearchDragEnd}
								onPointerCancel={handleMobileSearchDragEnd}
								onLostPointerCapture={handleMobileSearchDragEnd}
							>
								<div className='h-1.5 w-12 rounded-full bg-zinc-300' />
							</div>
							<div className='flex items-center justify-between border-b border-zinc-200 px-4 py-5'>
								<h2 className='text-2xl font-bold leading-none text-zinc-900 max-xs:text-3xl'>
									{t('mobile.searchTitle')}
								</h2>
								<button
									type='button'
									onClick={() => setMobileSearchOpen(false)}
									className='rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-100 max-xs:hidden'
									aria-label={t('mobile.closeSearch')}
								>
									<X className='h-5 w-5' />
								</button>
							</div>

							<div className='flex-1 overflow-y-auto p-4'>
								<div className='mb-4'>
									<input
										type='search'
										value={mobileSearchQuery}
										onChange={event => setMobileSearchQuery(event.target.value)}
										onKeyDown={event => {
											if (event.key === 'Enter') {
												event.preventDefault()
												handleMobileSearchSubmit()
											}
										}}
										placeholder={tSearch('inputPlaceHolder')}
										className='w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 focus:outline-none'
										autoFocus
									/>
								</div>

								{mobileSearchQueryTrimmed.length >= 2 && (
									<button
										type='button'
										onClick={handleMobileSearchSubmit}
										className='mb-4 w-full rounded-lg bg-zinc-100 px-4 py-3 text-left text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200'
									>
										{t('mobile.searchFor', { query: mobileSearchQueryTrimmed })}
									</button>
								)}

								<div className='space-y-1'>
									{showMobileSearchLoading ? (
										<div className='space-y-2'>
											<Skeleton className='h-8 w-full rounded-md' />
											<Skeleton className='h-8 w-full rounded-md' />
											<Skeleton className='h-8 w-full rounded-md' />
										</div>
									) : mobileSearchSuggestions.length > 0 ? (
										mobileSearchSuggestions.map(product => (
											<Link
												key={product.id}
												href={`/products/${product.slug}`}
												onClick={() => setMobileSearchOpen(false)}
												className='text-md block rounded-md px-2 py-2 text-zinc-900 transition-colors hover:bg-zinc-100 max-xs:text-base'
											>
												{product.name}
											</Link>
										))
									) : (
										<p className='px-2 py-2 text-sm text-zinc-500'>
											{t('mobile.noProductsFound')}
										</p>
									)}
								</div>
							</div>
						</div>
					</aside>
				</div>
			</header>

			<div
				className='pointer-events-none fixed bottom-0 left-0 right-0 top-[100px] z-10 rounded-t-[33px] border-t border-zinc-300 max-sm:top-[58px]'
				style={{
					transform: `translateY(${Math.abs(translate)}px)`,
					transition: 'transform 0.3s ease-out',
					boxShadow: '0 0 0 9999px #fff'
				}}
			/>
		</>
	)
}
