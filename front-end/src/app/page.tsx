'use client'

import { Banner, getBanners } from '@entities/banner'
import {
	type Product,
	type ProductSortBy,
	getProducts
} from '@entities/product'
import CurvedLoop from '@shared/components/CurvedLoop'
import { useScrollRevealHeader } from '@shared/hooks'
import { BannerCarousel } from '@widgets/banner-carousel'
import { FeaturesSection } from '@widgets/features-section'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { HeroSection } from '@widgets/hero-section'
import { ProductsCatalog } from '@widgets/products-catalog'
import { useEffect, useState } from 'react'

export default function Page() {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [sortBy, setSortBy] = useState<ProductSortBy | undefined>(undefined)
	const [banners, setBanners] = useState<Banner[]>([])

	useEffect(() => {
		loadProducts()
	}, [sortBy])

	const loadProducts = async () => {
		try {
			setLoading(true)
			const data = await getProducts({ sortBy })
			setProducts(data)
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const loadBanners = async () => {
			try {
				const data = await getBanners()
				setBanners(data)
			} catch (error) {
				console.error('Ошибка загрузки баннеров:', error)
			}
		}
		loadBanners()
	}, [])

	const { translate, isRevealed } = useScrollRevealHeader({
		hiddenOffset: 18,
		revealThreshold: 0
	})
	return (
		<>
			<Header />
			<div
				className='pointer-events-none fixed bottom-0 left-0 right-0 top-[112px] z-40 rounded-[33px] border-t border-zinc-300'
				style={{
					transform: `translateY(${translate}px)`,
					transition: 'transform 0.3s ease-out',
					boxShadow: '0 0 0 9999px #fff'
				}}
			/>

			<main className='min-w-full max-xs:pt-4 max-md:pt-8'>
				{banners.length === 0 ? <HeroSection /> : <BannerCarousel />}

				<ProductsCatalog
					products={products}
					loading={loading}
					sortBy={sortBy}
					onSortChange={setSortBy}
				/>

				<FeaturesSection />

				<div className='max-sm:hidden max-sm:py-6 max-md:pb-10'>
					<CurvedLoop
						marqueeText='Apple ✦ Razer ✦ Fifine ✦ Samsung ✦ Logitech ✦'
						speed={0.8}
						curveAmount={0}
						interactive={true}
						className='border-yellow-800 fill-black dark:fill-white'
					/>
				</div>
			</main>
			<Footer />
		</>
	)
}
