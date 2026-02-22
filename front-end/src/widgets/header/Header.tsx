'use client'

import { usePendingOrders } from '@entities/order'
import { useProfile } from '@entities/user'
import { LanguageSwitcher } from '@features/language-switcher'
import { useLogoutMutation } from '@features/user'
import { useScrollRevealHeader } from '@shared/hooks'
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
import { CartDropdown } from '@widgets/cart-dropdown'
import { FavoritesDropDown } from '@widgets/favorites-dropdown'
import { SearchBar } from '@widgets/search'
import { Menu, ScrollText, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { LuLogOut, LuSettings, LuShield } from 'react-icons/lu'

export default function Header() {
	const t = useTranslations('header')
	const { user, isLoading } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { data: pendingData } = usePendingOrders()
	const pendingCount = pendingData?.count || 0

	const { translateY, progress, prefersReducedMotion } = useScrollHeader({
		initialOffset: 55,
		scrollDistance: 80,
		respectMotionPreference: true
	})

	const { translate } = useScrollRevealHeader({
		hiddenOffset: 18,
		revealThreshold: 0
	})

	return (
		<>
			<div
				className='fixed left-0 right-0 top-0 z-[45] flex h-[80px] justify-center bg-pur pt-[18px] text-sm text-white'
				aria-hidden='true'
			>
				<h1>{t('notice')}</h1>
			</div>

			<header
				className='group sticky top-0 z-50 mb-10 w-full'
				style={{
					transform: `translateY(${translateY}px)`,
					willChange:
						translateY > 0 && !prefersReducedMotion ? 'transform' : 'auto'
				}}
			>
				{/* ... решта розмітки без змін ... */}

				<div
					className='relative z-20 w-full items-center bg-white'
					style={{ borderTopLeftRadius: '26px', borderTopRightRadius: '26px' }}
				>
					<div className='mx-auto flex h-[100px] max-w-[1280px] items-center justify-between px-4 py-4 text-lg font-bold max-sm:px-3 max-sm:py-3'>
						<Link href='/'>
							<Image
								src='/Frame 1.svg'
								alt='logo'
								width={130}
								height={40}
								priority
								className='h-[55px] w-auto max-sm:h-[35px]'
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
								<div className='flex gap-9'>
									<li>
										<CartDropdown />
									</li>
									<li>
										<FavoritesDropDown />
									</li>
									<li>
										{/* перемикач мов */}
										<LanguageSwitcher />
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
													{t('login')}
												</span>
											</Link>
										)}
									</li>
								</div>
							</ul>
						</nav>
					</div>
				</div>
			</header>
		</>
	)
}
