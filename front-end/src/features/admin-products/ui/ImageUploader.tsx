'use client'

import type { ProductImageDto } from '@entities/product'
import { Input } from '@shared/ui'
import { Trash2 } from 'lucide-react'

interface ImageUploaderProps {
	images: ProductImageDto[]
	onImagesChange: (images: ProductImageDto[]) => void
	onUpload: (files: FileList) => Promise<void>
	isUploading?: boolean
}

export function ImageUploader({
	images,
	onImagesChange,
	onUpload,
	isUploading = false
}: ImageUploaderProps) {
	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		await onUpload(files)
		e.target.value = ''
	}

	const handleRemoveImage = (index: number) => {
		onImagesChange(images.filter((_, i) => i !== index))
	}

	const handleSetMainImage = (index: number) => {
		onImagesChange(
			images.map((img, i) => ({
				...img,
				isMain: i === index
			}))
		)
	}

	return (
		<div>
			<label className='mb-1 block text-base font-medium'>Изображения</label>
			<div className='space-y-2'>
				<Input
					type='file'
					accept='image/*'
					multiple
					onChange={handleImageChange}
					disabled={isUploading}
					className='cursor-pointer'
				/>

				{images.length > 0 && (
					<div className='mt-4 grid grid-cols-3 gap-2'>
						{images.map((imageDto, index) => (
							<div key={index} className='relative'>
								<img
									src={imageDto.url}
									alt={`Preview ${index + 1}`}
									className='h-24 w-full rounded border object-cover'
								/>
								{imageDto.isMain && (
									<div className='absolute left-1 top-1 rounded bg-green-500 px-2 py-1 text-xs text-white'>
										Главное
									</div>
								)}
								<button
									type='button'
									onClick={() => handleRemoveImage(index)}
									className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600'
									aria-label='Удалить изображение'
								>
									<Trash2 className='h-4 w-4' />
								</button>
								{!imageDto.isMain && (
									<button
										type='button'
										onClick={() => handleSetMainImage(index)}
										className='absolute bottom-1 left-1 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600'
									>
										Сделать главным
									</button>
								)}
							</div>
						))}
					</div>
				)}

				<p className='text-xs text-gray-500'>
					Максимум 5 MB на файл. Форматы: JPG, PNG, GIF, WebP
				</p>

				{isUploading && (
					<div className='text-sm text-gray-600'>Загрузка...</div>
				)}
			</div>
		</div>
	)
}
