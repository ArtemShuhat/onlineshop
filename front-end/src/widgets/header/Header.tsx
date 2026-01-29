'use client'

import { usePendingOrders } from '@entities/order'
import { useProfile } from '@entities/user'
import { useLogoutMutation } from '@features/user'
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
import { Menu, ScrollText, X } from 'lucide-react'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { LuLogOut, LuSettings, LuShield } from 'react-icons/lu'

export default function Header() {
	const { user, isLoading } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { data: pendingData } = usePendingOrders()
	const pendingCount = pendingData?.count || 0

	return (
		<header className='sticky top-0 z-50 w-full bg-white p-4 duration-300 ease-out hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-sm:p-3'>
			<div className='mx-auto flex max-w-[1280px] items-center justify-between'>
				<Link href='/'>
					<Image
						src='/Frame 1.svg'
						alt='logo'
						width={130}
						height={40}
						priority
						className='h-[45px] w-auto max-sm:h-[35px]'
					/>
				</Link>

				<nav className='mx-10 flex-1 max-sm:hidden'>
					<ul className='flex items-center justify-evenly'>
						<li>
							<Link href='/'>
								<span className='text-black transition-colors hover:text-gray-600'>
									Магазин
								</span>
							</Link>
						</li>
						<li>
							<Link href='/coming-soon'>
								<span className='text-black transition-colors hover:text-gray-600'>
									Доставка
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
								{isLoading ? (
									<Skeleton className='h-10 w-20 rounded-full' />
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
											<span className='text-sm font-medium'>
												{user.displayName}
											</span>
										</DropdownMenuTrigger>
										<DropdownMenuContent className='w-48' align='end'>
											<DropdownMenuItem asChild>
												<Link
													href='/dashboard/settings'
													className='flex w-full cursor-pointer items-center'
												>
													<LuSettings className='mr-2 size-4' />
													Настройки профиля
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
															Админ-панель
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
															Заказы
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
												Выйти
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<Link href='/auth/login'>
										<span className='flex text-black transition-colors hover:text-gray-600'>
											<User className='mr-2 h-6 w-6' />
											Войти
										</span>
									</Link>
								)}
							</li>
						</div>
					</ul>
				</nav>

				<div className='hidden items-center gap-4 max-sm:flex'>
					<SearchBar />
					<CartDropdown />
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='text-black'
						aria-label='Toggle menu'
					>
						{mobileMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className='fixed inset-0 z-50 hidden bg-white max-sm:block'>
					<div className='flex h-full flex-col'>
						<div className='flex items-center justify-between border-b border-gray-200 p-3'>
							<Link href='/' onClick={() => setMobileMenuOpen(false)}>
								<Image
									src='/Frame 1.svg'
									alt='logo'
									width={120}
									height={40}
									priority
									className='h-[32px] w-auto'
								/>
							</Link>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className='text-black'
								aria-label='Close menu'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<nav className='flex-1 overflow-y-auto p-4'>
							<ul className='space-y-3'>
								<li>
									<Link
										href='/'
										onClick={() => setMobileMenuOpen(false)}
										className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
									>
										<span>Магазин</span>
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
									</Link>
								</li>
								<li>
									<Link
										href='/coming-soon'
										onClick={() => setMobileMenuOpen(false)}
										className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
									>
										<span>Доставка</span>
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
									</Link>
								</li>
								<li className='border-t border-gray-200 pt-3'>
									{isLoading ? (
										<Skeleton className='h-10 w-full rounded' />
									) : user ? (
										<div className='space-y-2'>
											<Link
												href='/dashboard/settings'
												onClick={() => setMobileMenuOpen(false)}
												className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
											>
												<div className='flex items-center'>
													<Avatar className='mr-2 h-6 w-6'>
														<AvatarImage src={user.picture} />
														<AvatarFallback>
															{user.displayName.slice(0, 1).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													{user.displayName}
												</div>
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
											</Link>
											<Link
												href='/orders'
												onClick={() => setMobileMenuOpen(false)}
												className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
											>
												<div className='flex items-center'>
													<ScrollText className='mr-2 h-4 w-4' />
													Заказы
												</div>
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
											</Link>
											{user.role === 'ADMIN' && (
												<Link
													href='/dashboard/admin'
													onClick={() => setMobileMenuOpen(false)}
													className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
												>
													<div className='flex items-center'>
														<LuShield className='mr-2 size-4' />
														Админ-панель
													</div>
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
												</Link>
											)}
											<button
												disabled={isLoadingLogout}
												onClick={() => {
													logout()
													setMobileMenuOpen(false)
												}}
												className='flex w-full items-center justify-between py-2 text-left text-black transition-colors hover:text-gray-600'
											>
												<div className='flex items-center'>
													<LuLogOut className='mr-2 size-4' />
													Выйти
												</div>
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
											</button>
										</div>
									) : (
										<Link
											href='/auth/login'
											onClick={() => setMobileMenuOpen(false)}
											className='flex items-center justify-between py-2 text-black transition-colors hover:text-gray-600'
										>
											<div className='flex items-center'>
												<User className='mr-2 h-4 w-4' />
												Войти
											</div>
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
										</Link>
									)}
								</li>
							</ul>
						</nav>
					</div>
				</div>
			)}
		</header>
	)
}
