'use client'

import { Category, createCategory, updateCategory } from '@entities/category'
import { translateText } from '@shared/api'
import { Button, Dialog, DialogContent, Input } from '@shared/ui'
import { CheckCircle2, Folder, Globe, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
	const t = useTranslations('adminCategoryFormToasts')
	const [nameRu, setNameRu] = useState('')
	const [nameEn, setNameEn] = useState('')
	const [nameUk, setNameUk] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isTranslating, setIsTranslating] = useState<{
		EN: boolean
		UK: boolean
	}>({ EN: false, UK: false })

	useEffect(() => {
		if (editingCategory) {
			setNameRu(editingCategory.nameRu)
			setNameEn(editingCategory.nameEn)
			setNameUk(editingCategory.nameUk)
		} else {
			setNameRu('')
			setNameEn('')
			setNameUk('')
		}
	}, [editingCategory, isOpen])

	const handleTranslate = async (lang: 'EN' | 'UK') => {
		if (!nameRu.trim()) {
			toast.error('Сначала введите название на русском')
			return
		}

		try {
			setIsTranslating(prev => ({ ...prev, [lang]: true }))
			const translated = await translateText(nameRu, lang)
			if (lang === 'EN') {
				setNameEn(translated)
			} else {
				setNameUk(translated)
			}
			toast.success(
				`Переведено на ${lang === 'EN' ? 'английский' : 'украинский'}`
			)
		} catch (error: any) {
			toast.error('Ошибка перевода: ' + (error.message || 'Попробуйте снова'))
		} finally {
			setIsTranslating(prev => ({ ...prev, [lang]: false }))
		}
	}

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault()

		if (!nameRu.trim()) {
			toast.error(t('enterName'))
			return
		}
		if (!nameEn.trim() || !nameUk.trim()) {
			toast.error('Заполните названия на всех языках')
			return
		}

		try {
			setIsLoading(true)
			if (editingCategory) {
				await updateCategory(editingCategory.id, {
					nameRu,
					nameEn,
					nameUk
				})
				toast.success(t('updated'))
			} else {
				await createCategory({ nameRu, nameEn, nameUk })
				toast.success(t('created', { name: nameRu }))
			}

			setTimeout(() => {
				setNameRu('')
				setNameEn('')
				setNameUk('')
				onSuccess()
				onClose()
			}, 0)
		} catch (error: any) {
			toast.error(error.message || t('saveFailed'))
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setNameRu('')
		setNameEn('')
		setNameUk('')
		onClose()
	}

	const allFilled = nameRu.trim() && nameEn.trim() && nameUk.trim()

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
								? 'Обновите названия на всех языках'
								: 'Создайте новую категорию для товаров'}
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='p-6'>
					<div className='space-y-4'>
						<div>
							<div className='mb-1.5 flex items-center gap-2'>
								<span className='inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700'>
									RU
								</span>
								<label className='text-sm font-medium text-gray-700'>
									Название (русский) <span className='text-red-500'>*</span>
								</label>
							</div>
							<Input
								value={nameRu}
								onChange={e => setNameRu(e.target.value)}
								placeholder='Телефоны, Ноутбуки...'
								disabled={isLoading}
								autoFocus
							/>
							<div className='mt-1 text-right text-xs text-gray-400'>
								{nameRu.length} символов
							</div>
						</div>
						<div>
							<div className='mb-1.5 flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span className='inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700'>
										EN
									</span>
									<label className='text-sm font-medium text-gray-700'>
										Name (English) <span className='text-red-500'>*</span>
									</label>
								</div>
								<button
									type='button'
									onClick={() => handleTranslate('EN')}
									disabled={!nameRu.trim() || isTranslating.EN || isLoading}
									className='flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50'
								>
									{isTranslating.EN ? (
										<Loader2 className='h-3 w-3 animate-spin' />
									) : (
										<Globe className='h-3 w-3' />
									)}
									Перевести
								</button>
							</div>
							<Input
								value={nameEn}
								onChange={e => setNameEn(e.target.value)}
								placeholder='Phones, Laptops...'
								disabled={isLoading}
							/>
						</div>
						<div>
							<div className='mb-1.5 flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span className='inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700'>
										UK
									</span>
									<label className='text-sm font-medium text-gray-700'>
										Назва (українська) <span className='text-red-500'>*</span>
									</label>
								</div>
								<button
									type='button'
									onClick={() => handleTranslate('UK')}
									disabled={!nameRu.trim() || isTranslating.UK || isLoading}
									className='flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50'
								>
									{isTranslating.UK ? (
										<Loader2 className='h-3 w-3 animate-spin' />
									) : (
										<Globe className='h-3 w-3' />
									)}
									Перекласти
								</button>
							</div>
							<Input
								value={nameUk}
								onChange={e => setNameUk(e.target.value)}
								placeholder='Телефони, Ноутбуки...'
								disabled={isLoading}
							/>
						</div>
						<div className='flex gap-3 pt-2'>
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
								disabled={isLoading || !allFilled}
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
