'use client'

import {
	type Category,
	deleteCategory,
	getCategories
} from '@entities/category'
import { useSortable } from '@shared/hooks'
import { Button, ConfirmDialog } from '@shared/ui'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CategoryFormDialog } from './CategoryFormDialog'
import { CategoriesTable, CategorySortColumn } from './CategoryTable'

export function AdminCategoriesSection() {
	const [categories, setCategories] = useState<Category[]>([])
	const [loadingCategories, setLoadingCategories] = useState(true)
	const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
	const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

	const { sortColumn, sortDirection, handleSort, getSortedData } =
		useSortable<CategorySortColumn>('id', 'desc')

	useEffect(() => {
		loadCategories()
	}, [])

	const loadCategories = async () => {
		try {
			setLoadingCategories(true)
			const data = await getCategories()
			setCategories(data)
		} catch (error) {
			console.error('Ошибка загрузки категорий:', error)
			alert('Не удалось загрузить категории')
		} finally {
			setLoadingCategories(false)
		}
	}

	const sortedCategories = getSortedData(categories, (a, b, column) => {
		switch (column) {
			case 'id':
				return a.id - b.id
			case 'name':
				return a.name.localeCompare(b.name, 'ru')
			case 'createdAt':
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			default:
				return 0
		}
	})

	const handleOpenCreateCategory = () => {
		setEditingCategory(null)
		setIsCategoryDialogOpen(true)
	}

	const handleOpenEditCategory = (category: Category) => {
		setEditingCategory(category)
		setIsCategoryDialogOpen(true)
	}

	const handleDeleteCategory = (id: number) => {
		setCategoryToDelete(id)
		setDeleteConfirmOpen(true)
	}

	const confirmDelete = async () => {
		if (!categoryToDelete) return

		try {
			await deleteCategory(categoryToDelete)
			toast.success('Категория удалена')
			loadCategories()
		} catch (error: any) {
			toast.error(error.message || 'Не удалось удалить категорию')
		} finally {
			setCategoryToDelete(null)
		}
	}

	if (loadingCategories) {
		return (
			<div className='flex min-h-screen items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900'></div>
					<p className='mt-4 text-gray-600'>Загрузка категорий...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='mt-4 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Управление категориями</h2>
				<Button onClick={handleOpenCreateCategory}>
					<Plus className='mr-2 h-4 w-4' />
					Добавить категорию
				</Button>
			</div>

			<CategoriesTable
				categories={sortedCategories}
				onEdit={handleOpenEditCategory}
				onDelete={handleDeleteCategory}
				sortColumn={sortColumn}
				sortDirection={sortDirection}
				onSort={handleSort}
			/>

			<CategoryFormDialog
				isOpen={isCategoryDialogOpen}
				onClose={() => {
					setIsCategoryDialogOpen(false)
					setEditingCategory(null)
				}}
				editingCategory={editingCategory}
				onSuccess={loadCategories}
			/>

			<ConfirmDialog
				isOpen={deleteConfirmOpen}
				onClose={() => {
					setDeleteConfirmOpen(false)
					setCategoryToDelete(null)
				}}
				onConfirm={confirmDelete}
				title='Удалить категорию?'
				description='Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.'
				confirmText='Удалить'
				cancelText='Отмена'
				variant='danger'
			/>
		</div>
	)
}
