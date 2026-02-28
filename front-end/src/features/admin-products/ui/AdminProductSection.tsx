'use client'

import type { Product } from '@entities/product'
import { getProducts } from '@entities/product'
import { useSortable } from '@shared/hooks'
import { Button } from '@shared/ui'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ProductSortColumn, ProductTable } from './ProductTable'

export function AdminProductsSection() {
	const router = useRouter()
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	const { sortColumn, sortDirection, handleSort, getSortedData } =
		useSortable<ProductSortColumn>('id', 'desc')

	useEffect(() => {
		loadProducts()
	}, [])

	async function loadProducts() {
		try {
			setLoading(true)
			const data = await getProducts({ includeHidden: true })
			setProducts(data)
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error)
		} finally {
			setLoading(false)
		}
	}

	const sortedProducts = getSortedData(products, (a, b, column) => {
		switch (column) {
			case 'id':
				return a.id - b.id
			case 'name':
				return a.name.localeCompare(b.name, 'ru')
			case 'price':
				return a.priceUSD - b.priceUSD
			case 'category':
				const catA = a.category?.nameRu || ''
				const catB = b.category?.nameRu || ''
				return catA.localeCompare(catB, 'ru')
			default:
				return 0
		}
	})

	const handleCreateProduct = () => {
		router.push('/dashboard/admin/products/new')
	}

	const handleEditProduct = (product: Product) => {
		router.push(`/dashboard/admin/products/edit/${product.id}`)
	}

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
					<p className='mt-4 text-gray-600'>Загрузка товаров...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='mt-4 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Управление товарами</h2>
				<Button onClick={handleCreateProduct}>
					<Plus className='mr-2 h-4 w-4' />
					Добавить товар
				</Button>
			</div>

			<ProductTable
				products={sortedProducts}
				onEdit={handleEditProduct}
				onUpdate={loadProducts}
				sortColumn={sortColumn}
				sortDirection={sortDirection}
				onSort={handleSort}
			/>
		</div>
	)
}
