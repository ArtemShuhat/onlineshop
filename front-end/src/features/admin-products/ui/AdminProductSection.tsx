'use client'

import { type Product, deleteProduct, getProducts } from '@entities/product'
import { ProductFormDialog, ProductTable } from '@features/admin-products'
import { Button } from '@shared/ui'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AdminProductsSection() {
	const [products, setProducts] = useState<Product[]>([])
	const [loadingProducts, setLoadingProducts] = useState(true)
	const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	useEffect(() => {
		loadProducts()
	}, [])

	const loadProducts = async () => {
		try {
			setLoadingProducts(true)
			const data = await getProducts()
			setProducts(data)
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error)
			alert('Не удалось загрузить товары')
		} finally {
			setLoadingProducts(false)
		}
	}

	const handleOpenCreateProduct = () => {
		setEditingProduct(null)
		setIsProductDialogOpen(true)
	}

	const handleOpenEditProduct = (product: Product) => {
		setEditingProduct(product)
		setIsProductDialogOpen(true)
	}

	const handleDeleteProduct = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
			return
		}

		try {
			await deleteProduct(id)
			loadProducts()
		} catch (error: any) {
			alert(error.message || 'Не удалось удалить товар')
		}
	}

	if (loadingProducts) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
					<p className='mt-4 text-gray-600'>Загрузка товаров...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Управление товарами</h2>
				<Button onClick={handleOpenCreateProduct}>
					<Plus className='mr-2 h-4 w-4' />
					Добавить товар
				</Button>
			</div>

			<ProductTable
				products={products}
				onEdit={handleOpenEditProduct}
				onDelete={handleDeleteProduct}
			/>

			<ProductFormDialog
				isOpen={isProductDialogOpen}
				onClose={() => {
					setIsProductDialogOpen(false)
					setEditingProduct(null)
				}}
				editingProduct={editingProduct}
				onSuccess={loadProducts}
			/>
		</div>
	)
}
