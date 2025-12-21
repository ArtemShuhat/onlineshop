'use client'

import { type Product, getProducts } from '@entities/api/productsApi'
import { ProductCard } from '@widgets/productCard'
import { useEffect, useState } from 'react'

import Header from '@/widgets/header/Header'

export default function Page() {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadProducts()
	}, [])

	const loadProducts = async () => {
		try {
			setLoading(true)
			const data = await getProducts()
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
			<main className='min-w-[1280px] pt-12'>
				<section className='bg-gradient-to-r from-blue-600 to-purple-600 py-20'>
					<div className='mx-auto max-w-[1280px] px-4 text-center'>
						<h1 className='mb-4 text-5xl font-bold text-white'>
							Добро пожаловать в наш магазин
						</h1>
						<p className='text-xl text-blue-100'>
							Лучшие товары по лучшим ценам
						</p>
					</div>
				</section>
				<section className='mx-auto max-w-[1280px] px-4 py-12'>
					<div className='mb-8 flex items-center justify-between'>
						<h2 className='text-3xl font-bold text-gray-900'>Наши товары</h2>
						<p className='text-gray-600'>{products.length} товаров</p>
					</div>

					{loading ? (
						<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
							{[1, 2, 3, 4, 5, 6].map(i => (
								<div
									key={i}
									className='h-96 animate-pulse rounded-lg bg-gray-200'
								/>
							))}
						</div>
					) : products.length === 0 ? (
						<div className='py-20 text-center'>
							<p className='text-xl text-gray-500'>Товары пока не добавлены</p>
						</div>
					) : (
						<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
							{products.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</section>
			</main>
		</>
	)
}
