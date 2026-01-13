'use client'

import type { Category } from '@entities/category'
import { getCategories } from '@entities/category'
import type { CreateProductDto, Product } from '@entities/product'
import { createProduct, updateProduct } from '@entities/product'
import { useImageUpload } from '@features/admin-products'
import { ImageUploader } from '@features/admin-products'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@shared/ui'
import { Input } from '@shared/ui'
import { DialogHeader } from '@shared/ui'
import { Textarea } from '@shared/ui'
import { useEffect, useState } from 'react'

const EMPTY_FORM: CreateProductDto = {
	name: '',
	description: '',
	price: 0,
	quantity: 0,
	images: [],
	categoryId: undefined
}

interface ProductFormDialogProps {
	isOpen: boolean
	onClose: () => void
	editingProduct: Product | null
	onSuccess: () => void
}

export function ProductFormDialog({
	isOpen,
	onClose,
	editingProduct,
	onSuccess
}: ProductFormDialogProps) {
	const [categories, setCategories] = useState<Category[]>([])
	const [formData, setFormData] = useState<CreateProductDto>(EMPTY_FORM)
	const { uploadImages, isUploading } = useImageUpload()

	useEffect(() => {
		if (editingProduct) {
			setFormData({
				name: editingProduct.name,
				description: editingProduct.description,
				price: editingProduct.price,
				quantity: editingProduct.quantity,
				images: editingProduct.productImages.map(img => ({
					url: img.url,
					isMain: img.isMain
				})),
				categoryId: editingProduct.categoryId
			})
		} else {
			setFormData(EMPTY_FORM)
		}
	}, [editingProduct])

	useEffect(() => {
		async function loadCategories() {
			const data = await getCategories()
			setCategories(data)
		}
		loadCategories()
	}, [])

	const handleSave = async () => {
		try {
			if (editingProduct) {
				await updateProduct(editingProduct.id, formData)
			} else {
				await createProduct(formData)
			}

			setFormData(EMPTY_FORM)
			onSuccess()
			onClose()
		} catch (error: any) {
			alert(error.message)
		}
	}

	const handleCancel = () => {
		setFormData(EMPTY_FORM)
		onClose()
	}

	const handleUploadImages = async (files: FileList) => {
		try {
			const uploadedImages = await uploadImages(files)

			setFormData(prev => ({
				...prev,
				images: [...prev.images, ...uploadedImages]
			}))
		} catch (error) {
			console.error('Ошибка загрузки:', error)
			alert('Не удалось загрузить изображения')
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-h-[90vh] overflow-y-auto rounded-lg bg-white p-5 shadow'>
				<DialogHeader>
					<DialogTitle className='mb-3 text-2xl'>
						{editingProduct ? 'Редактировать товар' : 'Создать товар'}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div>
						<label className='mb-1 block text-base font-medium'>Название</label>
						<Input
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
							placeholder='iPhone 15 Pro'
						/>
					</div>

					<div>
						<label className='mb-1 block text-base font-medium'>
							Категория
						</label>
						<select
							value={formData.categoryId || ''}
							onChange={e => {
								setFormData({
									...formData,
									categoryId: e.target.value
										? Number(e.target.value)
										: undefined
								})
							}}
						>
							<option value=''>Без категории</option>
							{categories.map(cat => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
						{categories.length === 0 && (
							<p className='text-sm text-orange-500'>
								Категорий нет. Сначала создайте категорию
							</p>
						)}
					</div>

					<div>
						<label className='mb-1 block text-base font-medium'>Описание</label>
						<Textarea
							value={formData.description}
							onChange={e =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder='Описание товара...'
							rows={4}
						/>
					</div>

					<div>
						<label className='mb-1 block text-base font-medium'>Цена ($)</label>
						<Input
							type='number'
							value={formData.price === 0 ? '' : formData.price}
							onChange={e => {
								const value = e.target.value === '' ? 0 : Number(e.target.value)
								setFormData({ ...formData, price: value })
							}}
							placeholder='0'
						/>
					</div>

					<div>
						<label className='mb-1 block text-base font-medium'>
							Количество на складе
						</label>
						<Input
							type='number'
							value={formData.quantity === 0 ? '' : formData.quantity}
							onChange={e => {
								const value = e.target.value === '' ? 0 : Number(e.target.value)
								setFormData({ ...formData, quantity: value })
							}}
							placeholder='0'
							min='0'
						/>
						<p className='mt-1 text-xs text-gray-500'>
							Укажите сколько единиц товара есть в наличии
						</p>
					</div>

					<ImageUploader
						images={formData.images}
						onImagesChange={images => setFormData({ ...formData, images })}
						onUpload={handleUploadImages}
						isUploading={isUploading}
					/>

					<div className='flex justify-end gap-2 pt-4'>
						<Button variant='outline' onClick={handleCancel}>
							Отмена
						</Button>
						<Button onClick={handleSave} disabled={isUploading}>
							{editingProduct ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
