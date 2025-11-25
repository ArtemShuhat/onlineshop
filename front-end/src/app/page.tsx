import { buttonVariants } from '@shared/ui'
import Link from 'next/link'

import Header from '../widgets/header/Header'

export default function Page() {
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
