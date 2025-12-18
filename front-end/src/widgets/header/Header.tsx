'use client'

import { useProfile } from '@entities/api'
import { useLogoutMutation } from '@features/user/hooks'
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
import { CartDropdown } from '@widgets/cart-dropdown/CartDropdown'
import { Search } from 'lucide-react'
import { User } from 'lucide-react'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { LuLogOut, LuSettings, LuShield } from 'react-icons/lu'

export default function Header() {
	const { user, isLoading } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()

	return (
		<header className='sticky top-0 z-50 w-full bg-white p-4 duration-300 ease-out hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]'>
			<div className='mx-auto flex max-w-[1280px] items-center justify-evenly'>
				<Link href='/'>
					<img src='/Frame 1.svg' alt='logo' className='h-[40px]' />
				</Link>
				<nav className='mx-10 flex-1'>
					<ul className='flex items-center justify-evenly'>
						<li>
							<Link href='/'>
								<span className='text-black transition-colors hover:text-gray-600'>
									Магазин
								</span>
							</Link>
						</li>
						<li>
							<Link href='/catalog'>
								<span className='text-black transition-colors hover:text-gray-600'>
									Доставка
								</span>
							</Link>
						</li>
						<li>
							<div className='relative flex items-center'>
								<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-600' />
								<input
									type='search'
									placeholder='Поиск'
									className='w-80 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-200 focus:outline-none'
								/>
							</div>
						</li>
						<li>
							<CartDropdown />
						</li>
						<li>
							{isLoading ? (
								<Skeleton className='h-10 w-20 rounded-full bg-white' />
							) : user ? (
								<DropdownMenu>
									<DropdownMenuTrigger className='flex items-center gap-2 transition-colors hover:text-gray-600'>
										<Avatar className='h-8 w-8'>
											<AvatarImage src={user.picture} />
											<AvatarFallback>
												{user.displayName.slice(0, 1).toUpperCase()}
											</AvatarFallback>
										</Avatar>
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

										<DropdownMenuSeparator />
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
										<User className='mr-2' />
										Войти
									</span>
								</Link>
							)}
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
