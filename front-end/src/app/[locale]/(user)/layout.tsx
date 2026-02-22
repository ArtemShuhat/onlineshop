import { CartSyncProvider } from '@entities/cart'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'

export default function UserLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			<CartSyncProvider>
				<div className='relative flex min-h-screen flex-col'>{children}</div>
			</CartSyncProvider>
			<Footer />
		</>
	)
}
