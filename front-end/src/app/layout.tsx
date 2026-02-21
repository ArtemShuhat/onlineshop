import { MainProvider } from '@shared/providers'
import '@shared/styles/globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
	subsets: ['latin', 'cyrillic'],
	weight: ['600', '700', '800', '900']
})

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
			<body className={nunito.className} suppressHydrationWarning>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	)
}
