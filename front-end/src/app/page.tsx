'use client'

import {
	type Product,
	type ProductSortBy,
	getProducts
} from '@entities/api/productsApi'
import CurvedLoop from '@shared/components/CurvedLoop'
import { FeaturesSection } from '@widgets/features-section'
import Footer from '@widgets/footer/Footer'
import Header from '@widgets/header/Header'
import { HeroSection } from '@widgets/hero-section/HeroSection'
import { ProductsCatalog } from '@widgets/products-catalog/ProductsCatalog'
import { useEffect, useState } from 'react'

export default function Page() {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [sortBy, setSortBy] = useState<ProductSortBy | undefined>(undefined)

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

	return (
		<>
			<Header />
			<main className='min-w-full pt-12 max-xs:pt-4 max-md:pt-8'>
				<HeroSection />

				<ProductsCatalog
					products={products}
					loading={loading}
					sortBy={sortBy}
					onSortChange={setSortBy}
				/>

				<FeaturesSection />

				<div className='pb-12 max-sm:hidden max-sm:py-6 max-md:pb-10'>
					<CurvedLoop
						marqueeText='Лучшие ✦ Товары ✦ По ✦ Лучшим ✦ Ценам ✦'
						speed={1}
						curveAmount={0}
						interactive={true}
						className='fill-black dark:fill-white'
					/>
				</div>
			</main>
			<Footer />
		</>
	)
}
