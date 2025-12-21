'use client'

import {
	type Category,
	deleteCategory,
	getCategories
} from '@entities/api/categoriesApi'
import {
	type Product,
	deleteProducts,
	getProducts
} from '@entities/api/productsApi'
import { type Order } from '@entities/order'
import { CategoryFormDialog } from '@features/admin-products/ui/CategoryFormDialog'
import CategoryTable from '@features/admin-products/ui/CategoryTable'
import { ProductFormDialog } from '@features/admin-products/ui/ProductFormDialog'
import ProductTable from '@features/admin-products/ui/ProductTable'
import { useOrders } from '@features/admin-orders/hooks/useOrders'
import { useUpdateOrderStatus } from '@features/admin-orders/hooks/useUpdateOrderStatus'
import { OrdersTable } from '@features/admin-orders/ui/OrdersTable'
import { OrderDetailsDialog } from '@features/admin-orders/ui/OrderDetailsDialog'
import { AdminSidebar } from '@widgets/admin-sidebar/AdminSidebar'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/Button'

export default function AdminProductsPage() {
	// Products state
	const [products, setProducts] = useState<Product[]>([])
	const [loadingProducts, setLoadingProducts] = useState(true)
	const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	// Categories state
	const [categories, setCategories] = useState<Category[]>([])
	const [loadingCategories, setLoadingCategories] = useState(true)
	const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)

	// Orders state
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const { data: orders = [], isLoading: loadingOrders } = useOrders()
	const { mutate: updateStatus } = useUpdateOrderStatus()

	// Active tab
	const searchParams = useSearchParams()
	const activeTab = searchParams.get('tab') || 'products'

	useEffect(() => {
		loadProducts()
		loadCategories()
	}, [])

	const loadProducts = async () => {
		try {
			setLoadingProducts(true)
			const data = await getProducts()
			setProducts(data)
		} catch (error) {
			console.error('Ошибка загрузки:', error)
			alert('Не удалось загрузить товары')
		} finally {
			setLoadingProducts(false)
		}
	}

	const loadCategories = async () => {
		try {
			setLoadingCategories(true)
			const data = await getCategories()
			setCategories(data)
		} catch (error) {
			console.log('Ошибка загрузки', error)
			alert('Не удалось загрузить категории')
		} finally {
			setLoadingCategories(false)
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
			await deleteProducts(id)
			loadProducts()
		} catch (error: any) {
			alert(error.message)
		}
	}

	if (loadingProducts) {
		return <div>Загрузка...</div>
	}

	const handleOpenCreateCategory = () => {
		setEditingCategory(null)
		setIsCategoryDialogOpen(true)
	}

	const handleOpenEditCategory = (category: Category) => {
		setEditingCategory(category)
		setIsCategoryDialogOpen(true)
	}

	const handleDeleteCategory = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
			return
		}

		try {
			await deleteCategory(id)
			loadCategories()
			loadProducts()
		} catch (error: any) {
			alert(error.message)
		}
	}

	const isLoading =
		activeTab === 'products'
			? loadingProducts
			: activeTab === 'categories'
				? loadingCategories
				: loadingOrders

	if (isLoading) {
		return (
			<>
				<AdminSidebar />
				<div className='ml-64 flex h-screen flex-1 items-center justify-center'>
					<div className='text-center'>
						<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
						<p className='mt-4 text-gray-600'>Загрузка...</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<AdminSidebar />
			<div className='container mx-auto p-6'>
				<div className='mb-6 flex items-center justify-between pt-10'>
					<div>
						<h1 className='text-3xl font-bold'>
							{activeTab === 'products'
								? 'Управление товарами'
								: activeTab === 'categories'
									? 'Управление категориями'
									: 'Управление заказами'}
						</h1>
					</div>
					<div className='flex gap-2'>
						{activeTab === 'categories' ? (
							<Button onClick={handleOpenCreateCategory}>
								<Plus className='mr-2 h-4 w-4' />
								Добавить категорию
							</Button>
						) : activeTab === 'products' ? (
							<Button onClick={handleOpenCreateProduct}>
								<Plus className='mr-2 h-4 w-4' />
								Добавить товар
							</Button>
						) : null}
					</div>
				</div>

				{activeTab === 'products' ? (
					<ProductTable
						products={products}
						onEdit={handleOpenEditProduct}
						onDelete={handleDeleteProduct}
					/>
				) : activeTab === 'categories' ? (
					<CategoryTable
						categories={categories}
						onEdit={handleOpenEditCategory}
						onDelete={handleDeleteCategory}
					/>
				) : (
					<OrdersTable
						orders={orders}
						onStatusChange={(orderId, status) =>
							updateStatus({ orderId, status })
						}
						onViewDetails={order => setSelectedOrder(order)}
					/>
				)}

				<ProductFormDialog
					isOpen={isProductDialogOpen}
					onClose={() => {
						setIsProductDialogOpen(false)
						setEditingProduct(null)
					}}
					editingProduct={editingProduct}
					onSuccess={loadProducts}
				/>
				<CategoryFormDialog
					isOpen={isCategoryDialogOpen}
					onClose={() => setIsCategoryDialogOpen(false)}
					editingCategory={editingCategory}
					onSuccess={loadCategories}
				/>
				<OrderDetailsDialog
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			</div>
		</>
	)
}
