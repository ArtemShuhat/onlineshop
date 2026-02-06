'use client'

import type { ProductImageDto } from '@entities/product'
import { Eye, Pencil, Star, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

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
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [dragActive, setDragActive] = useState(false)

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			await onUpload(e.dataTransfer.files)
		}
	}

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

	const handleBrowseClick = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className='space-y-4'>
			<div
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={handleBrowseClick}
				className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
					dragActive
						? 'border-blue-500 bg-blue-50 shadow-lg'
						: 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
				} ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
			>
				<div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

				<div className='relative px-6 py-12 text-center'>
					<div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-300 group-hover:scale-110'>
						<Upload className='h-10 w-10 text-blue-600 transition-colors duration-300 group-hover:text-purple-600' />
					</div>

					<h3 className='mb-2 text-lg font-semibold text-gray-700'>
						{dragActive
							? 'Отпустите файлы здесь'
							: 'Перетяните изображения сюда'}
					</h3>
					<p className='mb-1 text-sm text-gray-500'>
						или нажмите, чтобы выбрать файлы
					</p>
					<p className='text-xs text-gray-400'>PNG, JPG, GIF, WebP до 5MB</p>
				</div>

				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple
					onChange={handleImageChange}
					className='hidden'
				/>
			</div>

			{isUploading && (
				<div className='space-y-2 rounded-xl bg-blue-50 p-4'>
					<div className='flex items-center justify-between text-sm'>
						<span className='font-medium text-blue-900'>Загрузка...</span>
						<span className='text-blue-600'>
							<div className='h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent' />
						</span>
					</div>
					<div className='h-2 overflow-hidden rounded-full bg-blue-200'>
						<div className='h-full animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500' />
					</div>
				</div>
			)}

			{images.length > 0 && (
				<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
					{images.map((imageDto, index) => {
						const isMain = imageDto.isMain === true
						return (
							<div
								key={index}
								className={`group relative aspect-square overflow-hidden rounded-xl transition-all duration-300 ${
									isMain
										? 'ring-4 ring-emerald-500 ring-offset-2'
										: 'hover:scale-105'
								}`}
							>
								<Image
									src={imageDto.url}
									alt={`Product ${index + 1}`}
									fill
									className='object-cover transition-transform duration-300 group-hover:scale-110'
								/>

								{isMain && (
									<div className='absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm'>
										<Star className='h-3 w-3 fill-white' />
										Главное
									</div>
								)}

								<div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
									<button
										type='button'
										onClick={() => window.open(imageDto.url, '_blank')}
										className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-all hover:scale-110 hover:bg-white'
										title='Просмотр'
									>
										<Eye className='h-5 w-5' />
									</button>
									<button
										type='button'
										onClick={() => handleRemoveImage(index)}
										className='flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600'
										title='Удалить'
									>
										<Trash2 className='h-5 w-5' />
									</button>
								</div>

								{!isMain && (
									<button
										type='button'
										onClick={() => handleSetMainImage(index)}
										className='absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 rounded-lg bg-black/60 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100'
									>
										<Star className='h-3 w-3' />
										Сделать главным
									</button>
								)}
							</div>
						)
					})}
				</div>
			)}

			{images.length === 0 && !isUploading && (
				<div className='rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center'>
					<div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
						<Upload className='h-8 w-8 text-gray-400' />
					</div>
					<p className='text-sm text-gray-500'>
						Загрузите первое изображение товара
					</p>
				</div>
			)}

			{images.length > 0 && (
				<div className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm'>
					<span className='text-gray-600'>
						Загружено изображений:{' '}
						<span className='font-semibold'>{images.length}</span>
					</span>
					<span className='text-xs text-gray-500'>
						Первое изображение будет главным по умолчанию
					</span>
				</div>
			)}
		</div>
	)
}
