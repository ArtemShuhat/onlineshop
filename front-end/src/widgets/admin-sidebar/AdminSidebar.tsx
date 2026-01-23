'use client'

import { useProfile } from '@entities/user'
import { useLogoutMutation } from '@features/user'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@shared/ui'
import {
	BarChart3,
	Home,
	LogOut,
	Package,
	Settings,
	ShoppingCart,
	Tag,
	Truck
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function AdminSidebar() {
	const { user } = useProfile()
	const { logout } = useLogoutMutation()
	return (
		<>
			<aside className='fixed left-0 top-0 z-50 h-screen w-48 bg-white pl-2 pr-2 text-black duration-300 ease-out hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]'>
				<div className='p-6'>
					<Link href='/'>
						<Image src='/Frame 1.svg' alt='logo' width={160} height={40} />
					</Link>
				</div>

				<div className='space-y-1 p-4'>
					<Link href='/' className='flex transition-colors hover:text-gray-600'>
						<Home className='mr-1.5 h-5 w-5' />
						Магазин
					</Link>
				</div>
				<div className='mb-2 space-y-1 border-b p-4'>
					<Link
						href='/coming-soon'
						className='flex transition-colors hover:text-gray-600'
					>
						<Truck className='mr-1.5 h-5 w-5' />
						Доставка
					</Link>
				</div>

				<nav className='flex-1 space-y-3 p-4'>
					<p className='mb-5 text-lg'>Админ панель</p>
					<Link
						href='/dashboard/admin?tab=products'
						className='flex items-center pb-4 transition-colors hover:text-gray-600'
					>
						<Package className='mr-1.5 h-5 w-5' />
						Товары
					</Link>

					<Link
						href='/dashboard/admin?tab=categories'
						className='flex items-center pb-4 transition-colors hover:text-gray-600'
					>
						<Tag className='mr-1.5 h-5 w-5' />
						Категории
					</Link>

					<Link
						href='/dashboard/admin?tab=orders'
						className='flex items-center transition-colors hover:text-gray-600'
					>
						<ShoppingCart className='mr-1.5 h-5 w-5' />
						Заказы
					</Link>

					<Link
						href='/dashboard/admin/analytics'
						className='flex items-center pt-4 transition-colors hover:text-gray-600'
					>
						<BarChart3 className='mr-1.5 h-5 w-5' />
						Аналитика
					</Link>
				</nav>

				<div className='fixed bottom-0 pb-7'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='flex w-full items-center gap-3 rounded px-4 py-2 transition-colors hover:text-gray-600'>
								<Avatar className='h-8 w-8'>
									<AvatarImage src={user?.picture} />
									<AvatarFallback>
										{user?.displayName.slice(0, 1).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='text-left'>
									<p className='text-sm font-medium'>{user?.displayName}</p>
									<p className='text-xs text-gray-400'>Admin</p>
								</div>
							</button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align='end'>
							<DropdownMenuItem asChild>
								<Link href='/dashboard/settings'>
									<Settings className='mr-2 h-4 w-4' />
									Настройки
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => logout()}>
								<LogOut className='mr-2 h-4 w-4' />
								Выйти
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</aside>
		</>
	)
}
