import { Search } from 'lucide-react'
import { User } from 'lucide-react'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
	return (
		<header className='sticky top-0 bg-white p-4 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ease-out duration-300'>
			<div className='mx-auto flex w-[1280px] items-center justify-evenly'>
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
							<Link href='/auth/login'>
								<span className='flex text-black transition-colors hover:text-gray-600'>
									<User className='mr-2' />
									Войти
								</span>
							</Link>
						</li>
						<li>
							<Link href='/'>
								<span className='flex text-black transition-colors hover:text-gray-600'>
									<ShoppingCart className='mr-2' />
									Корзина
								</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}
