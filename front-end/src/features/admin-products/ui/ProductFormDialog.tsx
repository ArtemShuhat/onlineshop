'use client'

import { Category, getCategories } from '@entities/api/categoriesApi'
import {
	type CreateProductDto,
	type Product,
	createProducts,
	updateProducts
} from '@entities/api/productsApi'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@shared/components/ui/dialog'
import { Textarea } from '@shared/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

const EMPTY_FORM: CreateProductDto = {
	name: '',
	description: '',
	price: 0,
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

	useEffect(() => {
		if (editingProduct) {
			setFormData({
				name: editingProduct.name,
				description: editingProduct.description,
				price: editingProduct.price,
				images: editingProduct.images,
				categoryId: editingProduct.categoryId
			})
		} else {
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
				await updateProducts(editingProduct.id, formData)
			} else {
				await createProducts(formData)
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

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		try {
			const uploadedUrls: string[] = []

			for (const file of Array.from(files)) {
				if (file.size > 5 * 1024 * 1024) {
					alert(`Файл ${file.name} слишком большой. Максимум 5MB`)
					continue
				}

				const url = await uploadToCloudinary(file)
				uploadedUrls.push(url)
			}

			setFormData(prev => ({
				...prev,
				images: [...prev.images, ...uploadedUrls]
			}))

			e.target.value = ''
		} catch (error) {
			console.error('Ошибка загрузки:', error)
			alert('Не удалось загрузить изображения')
		}
	}

	const uploadToCloudinary = async (file: File): Promise<string> => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append(
			'upload_preset',
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
		)
		formData.append('folder', 'products')

		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
		const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: formData
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(
				`Cloudinary Error: ${data.error?.message || JSON.stringify(data)}`
			)
		}

		return data.secure_url
	}

	const handleRemoveImage = (index: number) => {
		setFormData(prev => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index)
		}))
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
								Категорий нет. Сначала создайте категорю
							</p>
						)}
					</div>

					<div>
						<label className='mb-1 block text-base font-medium'>Описание</label>
						<Textarea
							value={formData.description}
							onChange={(e: { target: { value: any } }) =>
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

					<div>
						<label className='mb-1 block text-base font-medium'>
							Изображения
						</label>
						<div className='space-y-2'>
							<Input
								type='file'
								accept='image/*'
								multiple
								onChange={handleImageChange}
								className='cursor-pointer'
							/>

							{formData.images.length > 0 && (
								<div className='mt-4 grid grid-cols-3 gap-2'>
									{formData.images.map((image, index) => (
										<div key={index} className='relative'>
											<img
												src={image}
												alt={`Preview ${index + 1}`}
												className='h-24 w-full rounded border object-cover'
											/>
											<button
												type='button'
												onClick={() => handleRemoveImage(index)}
												className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
											>
												<Trash2 className='h-4 w-4' />
											</button>
										</div>
									))}
								</div>
							)}

							<p className='text-xs text-gray-500'>
								Максимум 5 MB на файл. Форматы: JPG, PNG, GIF, WebP
							</p>
						</div>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button variant='outline' onClick={handleCancel}>
							Отмена
						</Button>
						<Button onClick={handleSave}>
							{editingProduct ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
