'use client'

import { Banner, getBanners } from '@entities/banner'
import {
	type Product,
	type ProductSortBy,
	getProducts
} from '@entities/product'
import CurvedLoop from '@shared/components/CurvedLoop'
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

	return (
		<>
			<main className='min-w-full max-xs:pt-4 max-md:pt-8'>
				<BannerCarousel />

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
		</>
	)
}
