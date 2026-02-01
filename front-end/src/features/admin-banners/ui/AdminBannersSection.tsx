'use client'

import {
	type Banner,
	createBanner,
	deleteBanner,
	getBannersAdmin,
	reorderBanners,
	updateBanner
} from '@entities/banner'
import { uploadToCloudinary } from '@features/admin-products/services/cloudinary/cloudinary.service'
import { Button, Input } from '@shared/ui'
import {
	ArrowDown,
	ArrowUp,
	Eye,
	EyeOff,
	Plus,
	Trash2,
	Upload
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export function AdminBannersSection() {
	const [banners, setBanners] = useState<Banner[]>([])
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [isDragging, setIsDragging] = useState(false)

	useEffect(() => {
		loadBanners()
	}, [])

	const loadBanners = async () => {
		try {
			setLoading(true)
			const data = await getBannersAdmin()
			setBanners(Array.isArray(data) ? data : [])
		} catch (error) {
			console.error('Ошибка загрузки баннеров:', error)
			setBanners([])
		} finally {
			setLoading(false)
		}
	}

	const uploadFiles = async (files: FileList | File[]) => {
		const fileArray = Array.from(files).filter(file =>
			file.type.startsWith('image/')
		)

		if (fileArray.length === 0) {
			alert('Пожалуйста, выберите изображения')
			return
		}

		setUploading(true)
		try {
			for (const file of fileArray) {
				const url = await uploadToCloudinary({
					file,
					folder: 'banners'
				})
				await createBanner({ url })
			}
			await loadBanners()
		} catch (error: any) {
			console.error('Ошибка загрузки:', error)
			alert(error.message || 'Не удалось загрузить изображение')
		} finally {
			setUploading(false)
		}
	}

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return
		await uploadFiles(files)
		e.target.value = ''
	}

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			await uploadFiles(files)
		}
	}, [])

	const handleDelete = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот баннер?')) return

		try {
			await deleteBanner(id)
			await loadBanners()
		} catch (error: any) {
			alert(error.message || 'Не удалось удалить баннер')
		}
	}

	const handleToggleActive = async (banner: Banner) => {
		try {
			await updateBanner(banner.id, { isActive: !banner.isActive })
			await loadBanners()
		} catch (error: any) {
			alert(error.message || 'Не удалось обновить баннер')
		}
	}

	const handleMoveUp = async (index: number) => {
		if (index === 0) return

		const newBanners = [...banners]
		;[newBanners[index - 1], newBanners[index]] = [
			newBanners[index],
			newBanners[index - 1]
		]

		try {
			await reorderBanners(newBanners.map(b => b.id))
			setBanners(newBanners)
		} catch (error: any) {
			alert(error.message || 'Не удалось изменить порядок')
		}
	}

	const handleMoveDown = async (index: number) => {
		if (index === banners.length - 1) return

		const newBanners = [...banners]
		;[newBanners[index], newBanners[index + 1]] = [
			newBanners[index + 1],
			newBanners[index]
		]

		try {
			await reorderBanners(newBanners.map(b => b.id))
			setBanners(newBanners)
		} catch (error: any) {
			alert(error.message || 'Не удалось изменить порядок')
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900' />
					<p className='mt-4 text-gray-600'>Загрузка баннеров...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='mt-4 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Управление каруселью</h2>
				<div className='flex items-center gap-4'>
					<span className='text-sm text-gray-500'>
						Всего баннеров: {banners.length}
					</span>
					<label>
						<Button disabled={uploading} asChild>
							<span className='cursor-pointer'>
								<Plus className='mr-2 h-4 w-4' />
								{uploading ? 'Загрузка...' : 'Добавить баннер'}
							</span>
						</Button>
						<Input
							type='file'
							accept='image/*'
							multiple
							onChange={handleUpload}
							disabled={uploading}
							className='hidden'
						/>
					</label>
				</div>
			</div>

			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
					isDragging
						? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
						: 'border-gray-300 dark:border-gray-600'
				} ${uploading ? 'pointer-events-none opacity-50' : ''}`}
			>
				<Upload
					className={`mb-2 h-8 w-8 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`}
				/>
				<p className='text-sm text-gray-500'>
					{uploading ? 'Загрузка...' : 'Или перетащите изображения сюда'}
				</p>
			</div>

			{banners.length === 0 ? (
				<div className='rounded-lg border border-dashed border-gray-300 p-12 text-center'>
					<p className='text-gray-500'>Нет баннеров. Добавьте первый баннер!</p>
				</div>
			) : (
				<div className='space-y-4'>
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							className={`flex items-center gap-4 rounded-lg border p-4 ${
								!banner.isActive
									? 'bg-gray-100 opacity-60 dark:bg-gray-800'
									: ''
							}`}
						>
							<div className='flex flex-col gap-1'>
								<button
									onClick={() => handleMoveUp(index)}
									disabled={index === 0}
									className='rounded p-1 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-700'
									aria-label='Переместить вверх'
								>
									<ArrowUp className='h-4 w-4' />
								</button>
								<button
									onClick={() => handleMoveDown(index)}
									disabled={index === banners.length - 1}
									className='rounded p-1 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-700'
									aria-label='Переместить вниз'
								>
									<ArrowDown className='h-4 w-4' />
								</button>
							</div>

							<div className='relative h-20 w-40 flex-shrink-0 overflow-hidden rounded'>
								<Image
									src={banner.url}
									alt={`Banner ${banner.id}`}
									fill
									className='object-cover'
								/>
							</div>

							<div className='flex-1'>
								<p className='text-sm text-gray-500'>Порядок: {index + 1}</p>
								<p className='text-xs text-gray-400'>ID: {banner.id}</p>
							</div>

							<div className='flex items-center gap-2'>
								<button
									onClick={() => handleToggleActive(banner)}
									className={`rounded p-2 transition-colors ${
										banner.isActive
											? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
											: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
									aria-label={banner.isActive ? 'Скрыть' : 'Показать'}
								>
									{banner.isActive ? (
										<Eye className='h-5 w-5' />
									) : (
										<EyeOff className='h-5 w-5' />
									)}
								</button>
								<button
									onClick={() => handleDelete(banner.id)}
									className='rounded p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20'
									aria-label='Удалить'
								>
									<Trash2 className='h-5 w-5' />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<p className='text-sm text-gray-500'>
				Используйте стрелки для изменения порядка. Скрытые баннеры не
				отображаются на главной странице.
			</p>
		</div>
	)
}
