import { MainProvider } from '@shared/providers'
import '@shared/styles/globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
	subsets: ['latin', 'cyrillic'],
	weight: ['600', '700', '800', '900']
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl)
}

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html suppressHydrationWarning>
			<body className={nunito.className} suppressHydrationWarning>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	)
}
