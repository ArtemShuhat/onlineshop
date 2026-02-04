'use client'

import type { Category } from '@entities/category'
import { getCategories } from '@entities/category'
import type {
	CreateProductDto,
	Product,
	ProductImageDto
} from '@entities/product'
import { createProduct, updateProduct } from '@entities/product'
import { useImageUpload } from '@features/admin-products'
import { ImageUploader } from '@features/admin-products'
import { Button, Input, Textarea } from '@shared/ui'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const EMPTY_FORM: CreateProductDto = {
	name: '',
	description: '',
	price: 0,
	quantity: 0,
	images: [],
	categoryId: undefined,
	searchKeywords: []
}

interface ProductFormProps {
	mode: 'create' | 'edit'
	initialProduct?: Product
}

export function ProductForm({ mode, initialProduct }: ProductFormProps) {
	const router = useRouter()
	const [categories, setCategories] = useState<Category[]>([])
	const [formData, setFormData] = useState<CreateProductDto>(EMPTY_FORM)
	const [keywordInput, setKeywordInput] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const { uploadImages, isUploading } = useImageUpload()

	useEffect(() => {
		if (initialProduct && mode === 'edit') {
			setFormData({
				name: initialProduct.name,
				description: initialProduct.description,
				price: initialProduct.price,
				quantity: initialProduct.quantity,
				images: initialProduct.productImages.map(img => ({
					url: img.url,
					isMain: img.isMain
				})),
				categoryId: initialProduct.categoryId ?? undefined,
				searchKeywords: initialProduct.searchKeywords || []
			})
		}
	}, [initialProduct, mode])

	useEffect(() => {
		async function loadCategories() {
			try {
				const data = await getCategories()
				setCategories(data)
			} catch (error) {
				toast.error('Ошибка загрузки категорий')
			}
		}
		loadCategories()
	}, [])

	const handleSave = async () => {
		if (
			!formData.name ||
			!formData.description ||
			formData.images.length === 0
		) {
			toast.error('Заполните все обязательные поля')
			return
		}

		try {
			setIsSaving(true)

			if (mode === 'edit' && initialProduct) {
				await updateProduct(initialProduct.id, formData)
				toast.success('Товар успешно обновлен')
			} else {
				await createProduct(formData)
				toast.success('Товар успешно создан')
			}

			router.push('/dashboard/admin/products')
		} catch (error: any) {
			toast.error(error.message || 'Произошла ошибка')
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		router.push('/dashboard/admin/products')
	}

	const handleUploadImages = async (files: FileList) => {
		try {
			const uploadedImages = await uploadImages(files)
			setFormData(prev => ({
				...prev,
				images: [...prev.images, ...uploadedImages]
			}))
			toast.success(`Загружено ${uploadedImages.length} изображений`)
		} catch (error) {
			toast.error('Не удалось загрузить изображения')
		}
	}

	const handleAddKeyword = () => {
		const keyword = keywordInput.trim()
		if (keyword && !formData.searchKeywords?.includes(keyword)) {
			setFormData(prev => ({
				...prev,
				searchKeywords: [...(prev.searchKeywords || []), keyword]
			}))
			setKeywordInput('')
		}
	}

	const handleRemoveKeyword = (index: number) => {
		setFormData(prev => ({
			...prev,
			searchKeywords: prev.searchKeywords?.filter((_, i) => i !== index)
		}))
	}

	const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddKeyword()
		}
	}

	return (
		<div className='space-y-6'>
			<div className='space-y-4'>
				<h2 className='text-lg font-semibold text-gray-900'>
					Основная информация
				</h2>

				<div>
					<label className='mb-1 block text-sm font-medium'>
						Название <span className='text-red-500'>*</span>
					</label>
					<Input
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						placeholder='iPhone 15 Pro'
					/>
				</div>

				<div>
					<label className='mb-1 block text-sm font-medium'>Категория</label>
					<select
						value={formData.categoryId || ''}
						onChange={e => {
							setFormData({
								...formData,
								categoryId: e.target.value ? Number(e.target.value) : undefined
							})
						}}
						className='w-full rounded-md border border-gray-300 px-3 py-2'
					>
						<option value=''>Без категории</option>
						{categories.map(cat => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='mb-1 block text-sm font-medium'>
						Описание <span className='text-red-500'>*</span>
					</label>
					<Textarea
						value={formData.description}
						onChange={e =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder='Описание товара...'
						rows={4}
					/>
				</div>
			</div>

			<div className='space-y-4'>
				<h2 className='text-lg font-semibold text-gray-900'>Цена и наличие</h2>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<label className='mb-1 block text-sm font-medium'>
							Цена ($) <span className='text-red-500'>*</span>
						</label>
						<Input
							type='number'
							value={formData.price}
							onChange={e =>
								setFormData({ ...formData, price: Number(e.target.value) })
							}
							placeholder='999'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium'>Количество</label>
						<Input
							type='number'
							value={formData.quantity}
							onChange={e =>
								setFormData({ ...formData, quantity: Number(e.target.value) })
							}
							placeholder='10'
						/>
					</div>
				</div>
			</div>

			<div className='space-y-4'>
				<h2 className='text-lg font-semibold text-gray-900'>
					Изображения <span className='text-red-500'>*</span>
				</h2>
				<ImageUploader
					images={formData.images}
					onUpload={handleUploadImages}
					onImagesChange={(images: ProductImageDto[]) =>
						setFormData({ ...formData, images })
					}
					isUploading={isUploading}
				/>
			</div>

			<div className='space-y-4'>
				<h2 className='text-lg font-semibold text-gray-900'>SEO и поиск</h2>

				<div>
					<label className='mb-1 block text-sm font-medium'>
						Ключевые слова для поиска
					</label>
					<div className='flex gap-2'>
						<Input
							value={keywordInput}
							onChange={e => setKeywordInput(e.target.value)}
							onKeyDown={handleKeywordKeyDown}
							placeholder='Например: смартфон, телефон, apple...'
						/>
						<Button type='button' onClick={handleAddKeyword}>
							Добавить
						</Button>
					</div>
					{formData.searchKeywords && formData.searchKeywords.length > 0 && (
						<div className='mt-2 flex flex-wrap gap-2'>
							{formData.searchKeywords.map((keyword, index) => (
								<div
									key={index}
									className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'
								>
									<span>{keyword}</span>
									<button
										type='button'
										onClick={() => handleRemoveKeyword(index)}
										className='hover:text-blue-900'
									>
										<X className='h-3 w-3' />
									</button>
								</div>
							))}
						</div>
					)}
					<p className='mt-1 text-xs text-gray-500'>
						Базовые ключевые слова генерируются автоматически. Здесь можете
						добавить синонимы, популярные ошибки написания или маркетинговые
						термины
					</p>
				</div>
			</div>

			<div className='flex justify-end gap-3 border-t pt-6'>
				<Button variant='outline' onClick={handleCancel} disabled={isSaving}>
					Отмена
				</Button>
				<Button onClick={handleSave} disabled={isSaving || isUploading}>
					{isSaving
						? 'Сохранение...'
						: mode === 'edit'
							? 'Сохранить'
							: 'Создать'}
				</Button>
			</div>
		</div>
	)
}
