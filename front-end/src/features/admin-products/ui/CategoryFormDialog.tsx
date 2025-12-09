'use client'

import {
	Category,
	CreateCategoryDto,
	createCategory,
	updateCategory
} from '@entities/api/categories'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@shared/components/ui/dialog'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

interface CategoryFormDialogProps {
	isOpen: boolean
	onClose: () => void
	editingCategory: Category | null
	onSuccess: () => void
}

export function CategoryFormDialog({
	isOpen,
	onClose,
	onSuccess,
	editingCategory
}: CategoryFormDialogProps) {
	const [categoryName, setCategoryName] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (editingCategory) {
			setCategoryName(editingCategory.name)
		} else {
			setCategoryName('')
		}
	}, [editingCategory, isOpen])

	const handleSubmit = async () => {
		if (!categoryName.trim()) {
			alert('Введите название категории')
			return
		}

		try {
			setIsLoading(true)
			if (editingCategory) {
				await updateCategory(editingCategory.id, { name: categoryName })
				alert(`Категория обновлена!`)
			} else {
				await createCategory({ name: categoryName })
				alert(`Категория "${categoryName}" создана!`)
			}
			setCategoryName('')
			onSuccess()
			onClose()
		} catch (error: any) {
			alert(error.message || 'Ошибка при создании категории')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setCategoryName('')
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='rounded-lg bg-white p-5 shadow'>
				<DialogHeader>
					<DialogTitle className='mb-3 text-2xl'>
						{editingCategory ? 'Редактировать категорию' : ' Создать категорию'}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div>
						<label className='mb-1 block text-base font-medium'>
							Название категории
						</label>
						<Input
							value={categoryName}
							onChange={e => setCategoryName(e.target.value)}
							placeholder='Например: Телефоны'
							disabled={isLoading}
						/>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button
							variant='outline'
							onClick={handleCancel}
							disabled={isLoading}
						>
							Отмена
						</Button>
						<Button onClick={handleSubmit} disabled={isLoading}>
							{isLoading
								? 'Сохранение...'
								: editingCategory
									? 'Сохранить'
									: 'Создать'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
