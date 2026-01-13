'use client'

import { type Product, getProducts } from '@entities/product'
import { Header } from '@widgets/header'
import { ProductCard } from '@widgets/product-card'
import { Search as SearchIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get('q') || ''

	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function search() {
			if (!query || query.length < 2) {
				setProducts([])
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				const results = await getProducts({ searchTerm: query })
				setProducts(results)
			} catch (error) {
				console.error('Ошибка поиска:', error)
				setProducts([])
			} finally {
				setLoading(false)
			}
		}

		search()
	}, [query])

	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className='flex-1'>
				{loading ? (
					<div className='mx-auto max-w-[1280px] px-4 py-8'>
						<div className='mb-6'>
							<h1 className='mb-2 text-3xl font-bold text-gray-900'>
								Результаты поиска: "{query}"
							</h1>
						</div>
						<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
							{[1, 2, 3, 4, 5, 6].map(i => (
								<div
									key={i}
									className='h-96 animate-pulse rounded-lg bg-gray-200'
								/>
							))}
						</div>
					</div>
				) : !query || query.length < 2 ? (
					<div className='flex h-full items-center justify-center py-20'>
						<div className='text-center'>
							<SearchIcon className='mx-auto h-16 w-16 text-gray-300' />
							<h2 className='mt-4 text-xl font-semibold text-gray-900'>
								Введите запрос для поиска
							</h2>
							<p className='mt-2 text-gray-500'>
								Используйте строку поиска выше для поиска товаров
							</p>
						</div>
					</div>
				) : products.length === 0 ? (
					<div className='flex h-full items-center justify-center py-20'>
						<div className='text-center'>
							<SearchIcon className='mx-auto h-16 w-16 text-gray-300' />
							<h2 className='mt-4 text-xl font-semibold text-gray-900'>
								Ничего не найдено
							</h2>
							<p className='mt-2 text-gray-500'>
								По запросу "{query}" ничего не найдено. Попробуйте изменить
								запрос.
							</p>
						</div>
					</div>
				) : (
					<div className='mx-auto max-w-[1280px] px-4 py-8'>
						<div className='mb-6'>
							<h1 className='mb-2 text-3xl font-bold text-gray-900'>
								Результаты поиска: "{query}"
							</h1>
							<p className='text-gray-600'>
								Найдено товаров: {products.length}
							</p>
						</div>
						<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
							{products.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	)
}
