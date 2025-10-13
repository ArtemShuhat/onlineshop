import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import { MainProvider } from '@/shared/providers'
import '@/shared/styles/globals.css'

const nunito = Nunito({ subsets: ['latin'], weight: '600' })

export const metadata: Metadata = {
	title: {
		absolute: 'Онлайн магазин девайсов',
		template: '%s | Онлайн магазин девайсов'
	},
	description: 'Онлайн магазин девайсов. Покупай легко и просто.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={nunito.className}>
				<MainProvider>
					<div className='relative flex min-h-screen flex-col items-center justify-center'>
						{children}
					</div>
				</MainProvider>
			</body>
		</html>
	)
}
