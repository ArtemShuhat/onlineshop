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
	DropdownMenuTrigger
} from '@shared/ui'
import { CartDropdown } from '@widgets/cart-dropdown'
import { FavoritesDropDown } from '@widgets/favorites-dropdown'
import { SearchBar } from '@widgets/search'
import { ScrollText, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LuLogOut, LuSettings, LuShield } from 'react-icons/lu'

export function DesktopNav() {
	const t = useTranslations('header')
	const { user } = useProfile()
	const { logout, isLoadingLogout } = useLogoutMutation()
	const { data: pendingData } = usePendingOrders()
	const pendingCount = pendingData?.count ?? 0

	return (
		<nav className='flex w-[1200px] items-center justify-between max-sm:hidden '>
			<Link href='/'>
				<span className='text-black transition-colors hover:text-gray-600'>
					{t('shop')}
				</span>
			</Link>

			<Link href='/coming-soon'>
				<span className='text-black transition-colors hover:text-gray-600'>
					{t('delivery')}
				</span>
			</Link>

			<SearchBar className='w-[350px] max-md:w-[300px]' />

			<div className='flex items-center gap-10 max-md:gap-8'>
				<CartDropdown />
				<FavoritesDropDown />
				{user ? (
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
						<DropdownMenuContent className='w-48 font-bold' align='end'>
							<DropdownMenuItem asChild>
								<Link
									href='/dashboard/settings'
									className='flex w-full cursor-pointer items-center'
								>
									<LuSettings className='mr-1 size-4' />
									<p>{t('settings')}</p>
								</Link>
							</DropdownMenuItem>
							{user.role === 'ADMIN' && (
								<>
									<DropdownMenuItem asChild>
										<Link
											href='/dashboard/admin'
											className='flex w-full cursor-pointer items-center'
										>
											<LuShield className='mr-1 size-4' />
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
											<div className='relative mr-1'>
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
								<LuLogOut className='mr-1 size-4 text-red-800' />
								<span className='text-red-800'>{t('logout')}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link href='/auth/login'>
						<span className='flex text-black transition-colors hover:text-gray-600'>
							<User className='h-6 w-6' />
						</span>
					</Link>
				)}
			</div>
		</nav>
	)
}
