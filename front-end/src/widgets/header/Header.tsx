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
import { SearchBar } from '@widgets/search/SearchBar'
import { ScrollText, Search } from 'lucide-react'
import { User } from 'lucide-react'
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
							<SearchBar />
						</li>
						<li>
							<CartDropdown />
						</li>
						<li>
							{isLoading ? (
								<Skeleton className='h-10 w-20 rounded-full' />
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
										<DropdownMenuItem asChild>
											<Link
												href='/orders'
												className='flex w-full cursor-pointer items-center'
											>
												<ScrollText className='mr-2 size-4' />
												Заказы
											</Link>
										</DropdownMenuItem>
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
