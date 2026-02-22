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
import { ConfirmDialog } from '@shared/ui'
import {
	ArrowDown,
	ArrowUp,
	Eye,
	EyeOff,
	GripVertical,
	ImageIcon,
	Info,
	Trash2,
	Upload
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function AdminBannersSection() {
	const t = useTranslations('adminBannersToasts')
	const [banners, setBanners] = useState<Banner[]>([])
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [dragActive, setDragActive] = useState(false)
	const [draggedItemId, setDraggedItemId] = useState<number | null>(null)
	const [dragOverItemId, setDragOverItemId] = useState<number | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
	const [bannerToDelete, setBannerToDelete] = useState<number | null>(null)

	useEffect(() => {
		loadBanners()
	}, [])

	const loadBanners = async () => {
		try {
			setLoading(true)
			const data = await getBannersAdmin()
			setBanners(Array.isArray(data) ? data : [])
		} catch (error) {
			toast.error(t('loadFailed'))
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
			toast.error(t('selectImages'))
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
			toast.success(t('uploadedBanners', { count: fileArray.length }))
			await loadBanners()
		} catch (error: any) {
			toast.error(error.message || t('uploadImageFailed'))
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

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			await uploadFiles(files)
		}
	}, [])

	const handleBrowseClick = () => {
		fileInputRef.current?.click()
	}

	const handleDelete = async (id: number) => {
		setBannerToDelete(id)
		setDeleteConfirmOpen(true)
	}

	const confirmDelete = async () => {
		if (!bannerToDelete) return

		try {
			await deleteBanner(bannerToDelete)
			toast.success(t('bannerDeleted'))
			await loadBanners()
		} catch (error: any) {
			toast.error(error.message || t('deleteBannerFailed'))
		} finally {
			setBannerToDelete(null)
		}
	}

	const handleToggleActive = async (banner: Banner) => {
		try {
			await updateBanner(banner.id, { isActive: !banner.isActive })
			toast.success(banner.isActive ? t('bannerHidden') : t('bannerActivated'))
			await loadBanners()
		} catch (error: any) {
			toast.error(error.message || t('updateBannerFailed'))
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
			toast.success(t('orderChanged'))
		} catch (error: any) {
			toast.error(error.message || t('changeOrderFailed'))
			await loadBanners()
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
			toast.success(t('orderChanged'))
		} catch (error: any) {
			toast.error(error.message || t('changeOrderFailed'))
			await loadBanners()
		}
	}

	const handleDragStart = (e: React.DragEvent, bannerId: number) => {
		setDraggedItemId(bannerId)
		e.dataTransfer.effectAllowed = 'move'
	}

	const handleDragEnter = (bannerId: number) => {
		setDragOverItemId(bannerId)
	}

	const handleDragEnd = () => {
		setDraggedItemId(null)
		setDragOverItemId(null)
	}

	const handleDropItem = async (e: React.DragEvent, targetBannerId: number) => {
		e.preventDefault()
		e.stopPropagation()

		if (!draggedItemId || draggedItemId === targetBannerId) {
			setDraggedItemId(null)
			setDragOverItemId(null)
			return
		}

		const draggedIndex = banners.findIndex(b => b.id === draggedItemId)
		const targetIndex = banners.findIndex(b => b.id === targetBannerId)

		if (draggedIndex === -1 || targetIndex === -1) return

		const newBanners = [...banners]
		const [draggedBanner] = newBanners.splice(draggedIndex, 1)
		newBanners.splice(targetIndex, 0, draggedBanner)

		try {
			setBanners(newBanners)
			await reorderBanners(newBanners.map(b => b.id))
			toast.success(t('orderChanged'))
		} catch (error: any) {
			toast.error(error.message || t('changeOrderFailed'))
			await loadBanners()
		} finally {
			setDraggedItemId(null)
			setDragOverItemId(null)
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pur' />
					<p className='mt-4 text-sm text-gray-600'>Загрузка баннеров...</p>
				</div>
			</div>
		)
	}

	const activeBanners = banners.filter(b => b.isActive).length
	const hiddenBanners = banners.length - activeBanners

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900'>
						Управление каруселью
					</h2>
					<div className='mt-1 flex items-center gap-4 text-sm text-gray-600'>
						<span className='flex items-center gap-1'>
							<ImageIcon className='h-4 w-4' />
							Всего: {banners.length}
						</span>
						<span className='text-gray-300'>•</span>
						<span className='flex items-center gap-1 text-green-600'>
							<Eye className='h-4 w-4' />
							Активных: {activeBanners}
						</span>
						{hiddenBanners > 0 && (
							<>
								<span className='text-gray-300'>•</span>
								<span className='flex items-center gap-1 text-gray-500'>
									<EyeOff className='h-4 w-4' />
									Скрытых: {hiddenBanners}
								</span>
							</>
						)}
					</div>
				</div>
			</div>

			<div
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={handleBrowseClick}
				className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
					dragActive
						? 'scale-[1.01] border-pur bg-purple-50 shadow-lg'
						: 'border-gray-300 bg-white hover:border-pur hover:bg-purple-50/50'
				} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
			>
				<div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

				<div className='relative px-6 py-12 text-center'>
					<div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 transition-transform duration-300 group-hover:scale-110'>
						<Upload className='h-10 w-10 text-purple-600 transition-colors duration-300 group-hover:text-purple-800' />
					</div>

					<h3 className='mb-2 text-lg font-semibold text-gray-700'>
						{dragActive
							? 'Отпустите файлы здесь'
							: 'Перетяните изображения сюда'}
					</h3>
					<p className='mb-1 text-sm text-gray-500'>
						или нажмите, чтобы выбрать файлы
					</p>
					<p className='text-xs text-gray-400'>
						Рекомендуемый размер: 1920×600px • PNG, JPG, WebP до 5MB
					</p>
				</div>

				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple
					onChange={handleUpload}
					className='hidden'
				/>
			</div>

			{uploading && (
				<div className='space-y-2 rounded-xl bg-purple-50 p-4'>
					<div className='flex items-center justify-between text-sm'>
						<span className='font-medium text-purple-900'>
							Загрузка изображений...
						</span>
						<span className='text-purple-600'>
							<div className='h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent' />
						</span>
					</div>
					<div className='h-2 overflow-hidden rounded-full bg-purple-200'>
						<div className='h-full animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500' />
					</div>
				</div>
			)}

			{banners.length === 0 ? (
				<div className='rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
						<ImageIcon className='h-8 w-8 text-gray-400' />
					</div>
					<h3 className='text-lg font-medium text-gray-900'>Нет баннеров</h3>
					<p className='mt-2 text-sm text-gray-500'>
						Добавьте первый баннер для карусели на главной странице
					</p>
				</div>
			) : (
				<div className='space-y-3'>
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							draggable
							onDragStart={e => handleDragStart(e, banner.id)}
							onDragEnd={handleDragEnd}
							onDragOver={e => {
								e.preventDefault()
								handleDragEnter(banner.id)
							}}
							onDrop={e => handleDropItem(e, banner.id)}
							className={`group flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all ${
								!banner.isActive ? 'opacity-60' : ''
							} ${
								draggedItemId === banner.id
									? 'scale-105 cursor-grabbing opacity-50 shadow-lg'
									: 'cursor-grab hover:shadow-md'
							} ${
								dragOverItemId === banner.id && draggedItemId !== banner.id
									? 'border-pur bg-purple-50'
									: ''
							}`}
						>
							<div className='flex flex-col items-center gap-1'>
								<GripVertical className='h-5 w-5 cursor-grab text-gray-400 transition-colors active:cursor-grabbing group-hover:text-pur' />
								<div className='flex flex-col gap-0.5'>
									<button
										onClick={() => handleMoveUp(index)}
										disabled={index === 0}
										className='rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30'
										title='Переместить вверх'
									>
										<ArrowUp className='h-4 w-4' />
									</button>
									<button
										onClick={() => handleMoveDown(index)}
										disabled={index === banners.length - 1}
										className='rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30'
										title='Переместить вниз'
									>
										<ArrowDown className='h-4 w-4' />
									</button>
								</div>
							</div>

							<div className='relative h-24 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm'>
								<Image
									src={banner.url}
									alt={`Banner ${banner.id}`}
									fill
									className='object-cover'
								/>
								{!banner.isActive && (
									<div className='absolute inset-0 flex items-center justify-center bg-black/50'>
										<EyeOff className='h-6 w-6 text-white' />
									</div>
								)}
							</div>

							<div className='flex-1'>
								<div className='flex items-center gap-2'>
									<span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700'>
										#{index + 1}
									</span>
									{banner.isActive ? (
										<span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700'>
											<Eye className='h-3 w-3' />
											Активен
										</span>
									) : (
										<span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600'>
											<EyeOff className='h-3 w-3' />
											Скрыт
										</span>
									)}
								</div>
								<p className='mt-1 text-xs text-gray-500'>ID: {banner.id}</p>
							</div>

							<div className='flex items-center gap-1'>
								<button
									onClick={() => handleToggleActive(banner)}
									className={`rounded-lg p-2 transition-all ${
										banner.isActive
											? 'text-green-600 hover:bg-green-50'
											: 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
									}`}
									title={banner.isActive ? 'Скрыть баннер' : 'Показать баннер'}
								>
									{banner.isActive ? (
										<Eye className='h-5 w-5' />
									) : (
										<EyeOff className='h-5 w-5' />
									)}
								</button>
								<button
									onClick={() => handleDelete(banner.id)}
									className='rounded-lg p-2 text-red-600 transition-all hover:bg-red-50'
									title='Удалить баннер'
								>
									<Trash2 className='h-5 w-5' />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
			<ConfirmDialog
				isOpen={deleteConfirmOpen}
				onClose={() => {
					setDeleteConfirmOpen(false)
					setBannerToDelete(null)
				}}
				onConfirm={confirmDelete}
				title='Удалить баннер?'
				description='Вы уверены, что хотите удалить этот баннер? Это действие нельзя отменить.'
				confirmText='Удалить'
				cancelText='Отмена'
				variant='danger'
			/>
		</div>
	)
}
