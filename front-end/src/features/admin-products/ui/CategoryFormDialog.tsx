'use client'

import { Category, createCategory, updateCategory } from '@entities/category'
import { Button, Dialog, DialogContent, Input } from '@shared/ui'
import { CheckCircle2, Folder } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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
	const [showSuccess, setShowSuccess] = useState(false)

	useEffect(() => {
		if (editingCategory) {
			setCategoryName(editingCategory.name)
		} else {
			setCategoryName('')
		}
		setShowSuccess(false)
	}, [editingCategory, isOpen])

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault()

		if (!categoryName.trim()) {
			toast.error('Введите название категории')
			return
		}

		try {
			setIsLoading(true)
			if (editingCategory) {
				await updateCategory(editingCategory.id, { name: categoryName })
				setShowSuccess(true)
				toast.success('Категория успешно обновлена! ✨')
			} else {
				await createCategory({ name: categoryName })
				setShowSuccess(true)
				toast.success(`Категория "${categoryName}" создана! 🎉`)
			}

			setTimeout(() => {
				setCategoryName('')
				onSuccess()
				onClose()
				setShowSuccess(false)
			}, 800)
		} catch (error: any) {
			toast.error(error.message || 'Ошибка при сохранении категории')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setCategoryName('')
		onClose()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			handleSubmit()
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl [&>button]:text-white [&_svg]:stroke-[2.4]'>
				<div className='relative overflow-hidden bg-gradient-to-br from-blue-500 to-pur px-6 py-8'>
					<div className='relative'>
						<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md'>
							<Folder className='h-8 w-8 text-white' />
						</div>
						<h2 className='text-2xl font-bold text-white'>
							{editingCategory ? 'Редактировать категорию' : 'Новая категория'}
						</h2>
						<p className='mt-1 text-sm text-blue-100'>
							{editingCategory
								? 'Обновите название категории'
								: 'Создайте новую категорию для товаров'}
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='p-6'>
					<div className='space-y-6'>
						<div className='relative'>
							<Input
								value={categoryName}
								onChange={e => setCategoryName(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder=' '
								disabled={isLoading}
								className='peer h-14 pt-6 text-base transition-all'
								autoFocus
							/>
							<label className='absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600'>
								Название категории <span className='text-red-500'>*</span>
							</label>

							<div className='mt-1.5 flex items-center justify-between text-xs'>
								<span className='text-gray-500'>
									Например: Телефоны, Ноутбуки, Наушники
								</span>
								<span className='text-gray-400'>
									{categoryName.length} символов
								</span>
							</div>
						</div>

						{showSuccess && (
							<div className='flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 animate-in fade-in slide-in-from-bottom-4'>
								<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-500'>
									<CheckCircle2 className='h-6 w-6 text-white' />
								</div>
								<div>
									<p className='font-semibold text-green-900'>Успешно!</p>
									<p className='text-sm text-green-700'>
										Категория {editingCategory ? 'обновлена' : 'создана'}
									</p>
								</div>
							</div>
						)}

						<div className='flex gap-3'>
							<Button
								type='button'
								variant='outline'
								onClick={handleCancel}
								disabled={isLoading}
								className='flex-1'
							>
								Отмена
							</Button>
							<Button
								type='submit'
								disabled={isLoading || !categoryName.trim()}
								className='hover:purh flex-1 bg-pur'
							>
								{isLoading ? (
									<>
										<div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
										Сохранение...
									</>
								) : (
									<>{editingCategory ? 'Сохранить' : 'Создать'}</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
