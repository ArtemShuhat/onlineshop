import Link from 'next/link'

import { buttonVariants } from '@/shared/components/ui'

import Header from '../shared/components/header/Header'

export default function Home() {
	return (
		<>
			<div className='relative w-full bg-slate-500'>
				<Header />
				<div className='space-y-5 text-center'>
					<h1 className='text-4xl font-bold'>Главная страница</h1>
					<Link href='/auth/login' className={buttonVariants()}>
						Войти в аккаунт
					</Link>
				</div>
			</div>
		</>
	)
}
