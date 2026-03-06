'use client'

import { useScrollRevealHeader } from '@shared/hooks'
import { useScrollHeader } from '@shared/hooks/useScrollHeader'
import { CartDropdown } from '@widgets/cart-dropdown'
import {
	DesktopNav,
	MobileMenuSheet,
	MobileSearchSheet,
	useBodyScrollLock
} from '@widgets/header'
import { Menu, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
	const t = useTranslations('header')
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

	useBodyScrollLock(mobileMenuOpen || mobileSearchOpen)

	const { translateY, progress, prefersReducedMotion } = useScrollHeader({
		initialOffset: 55,
		scrollDistance: 80,
		respectMotionPreference: true
	})

	const { translate } = useScrollRevealHeader({
		hiddenOffset: 0,
		revealThreshold: 800
	})

	return (
		<>
			<div
				className='flex h-[85px] w-full justify-center bg-pur pt-[18px] text-sm text-white'
				style={{ position: 'relative', zIndex: 20 }}
				aria-hidden='true'
			>
				<h1>{t('notice')}</h1>
			</div>

			<header className='group sticky top-0 z-50 mt-[-27px] w-full'>
				<div
					className='pointer-events-none absolute left-0 right-0 top-0 z-20 h-8 bg-white'
					style={{
						opacity: progress,
						transform: `translateY(${(1 - progress) * 100}%)`,
						transformOrigin: 'top',
						willChange:
							progress < 1 && !prefersReducedMotion
								? 'opacity, transform'
								: 'auto'
					}}
					aria-hidden='true'
				/>
				<div
					className='relative z-20 w-full items-center bg-white'
					style={{
						borderTopLeftRadius: '26px',
						borderTopRightRadius: '26px',
						borderBottomLeftRadius: '0',
						borderBottomRightRadius: '0',
						overflow: 'hidden'
					}}
				>
					<div className='mx-auto flex h-[100px] max-w-[1280px] items-center justify-between px-4 py-4 text-lg font-bold max-sm:h-auto max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:py-3'>
						<Link href='/' className='max-sm:hidden'>
							<Image
								src='/Frame 1.svg'
								alt={t('logoAlt')}
								width={130}
								height={40}
								priority
								className='h-[55px] w-auto max-sm:h-[35px] max-md:h-[45px]'
							/>
						</Link>

						<DesktopNav />

						{/* Mobile top bar */}
						<div className='relative hidden items-center justify-between max-sm:flex'>
							<button
								onClick={() => {
									setMobileSearchOpen(false)
									setMobileMenuOpen(prev => !prev)
								}}
								className='rounded-md p-1 text-black transition-colors hover:bg-gray-100'
								aria-label={t('mobile.toggleMenu')}
							>
								{mobileMenuOpen ? (
									<X className='h-6 w-6' />
								) : (
									<Menu className='h-6 w-6' />
								)}
							</button>

							<Link href='/' className='absolute left-1/2 -translate-x-1/2'>
								<Image
									src='/Frame 1.svg'
									alt={t('logoAlt')}
									width={130}
									height={40}
									priority
									className='h-[34px] w-auto max-sm:h-[40px]'
								/>
							</Link>

							<div className='ml-auto flex items-center gap-3'>
								<button
									type='button'
									onClick={() => {
										setMobileMenuOpen(false)
										setMobileSearchOpen(true)
									}}
									className='rounded-md p-1 text-black transition-colors hover:bg-gray-100'
									aria-label={t('mobile.openSearch')}
								>
									<Search className='h-5 w-5' />
								</button>
								<CartDropdown />
							</div>
						</div>
					</div>
				</div>

				<MobileMenuSheet
					isOpen={mobileMenuOpen}
					onClose={() => setMobileMenuOpen(false)}
				/>

				<MobileSearchSheet
					isOpen={mobileSearchOpen}
					onClose={() => setMobileSearchOpen(false)}
				/>
			</header>

			<div
				className='pointer-events-none fixed bottom-0 left-0 right-0 top-[100px] z-10 rounded-t-[33px] border-t border-zinc-300 max-sm:top-[58px]'
				style={{
					transform: `translateY(${Math.abs(translate)}px)`,
					transition: 'transform 0.3s ease-out',
					boxShadow: '0 0 0 9999px #fff'
				}}
			/>
		</>
	)
}
