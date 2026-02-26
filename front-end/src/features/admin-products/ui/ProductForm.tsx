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
import { Button, Input } from '@shared/ui'
import {
	ArrowLeft,
	CheckCircle2,
	Eye,
	EyeOff,
	Package,
	Save,
	Tag,
	X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ProductDescriptionFields } from './ProductDescriptionFields'
import { ProductPriceFields } from './ProductPriceFields'

const EMPTY_FORM: CreateProductDto = {
	name: '',
	descriptionRu: '',
	descriptionEn: '',
	descriptionUk: '',
	priceUSD: 0,
	priceEUR: 0,
	priceUAH: 0,
	quantity: 0,
	images: [],
	categoryId: undefined,
	searchKeywords: [],
	isVisible: true
}

interface ProductFormProps {
	mode: 'create' | 'edit'
	initialProduct?: Product
}

export function ProductForm({ mode, initialProduct }: ProductFormProps) {
	const t = useTranslations('adminProductFormToasts')
	const router = useRouter()
	const [categories, setCategories] = useState<Category[]>([])
	const [formData, setFormData] = useState<CreateProductDto>(EMPTY_FORM)
	const [keywordInput, setKeywordInput] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const { uploadImages, isUploading } = useImageUpload()

	useEffect(() => {
		if (initialProduct && mode === 'edit') {
			const productImages = initialProduct.productImages.map(img => ({
				url: img.url,
				isMain: img.isMain
			}))

			const hasMainImage = productImages.some(img => img.isMain)
			if (!hasMainImage && productImages.length > 0) {
				productImages[0].isMain = true
			}

			let mainImageFound = false
			productImages.forEach(img => {
				if (img.isMain && !mainImageFound) {
					mainImageFound = true
				} else if (img.isMain && mainImageFound) {
					img.isMain = false
				}
			})

			setFormData({
				name: initialProduct.name,
				descriptionRu: initialProduct.descriptionRu,
				descriptionEn: initialProduct.descriptionEn,
				descriptionUk: initialProduct.descriptionUk,
				priceUSD: initialProduct.priceUSD,
				priceEUR: initialProduct.priceEUR,
				priceUAH: initialProduct.priceUAH,
				quantity: initialProduct.quantity,
				images: productImages,
				categoryId: initialProduct.categoryId ?? undefined,
				searchKeywords: initialProduct.searchKeywords || [],
				isVisible: initialProduct.isVisible
			})
		}
	}, [initialProduct, mode])

	useEffect(() => {
		async function loadCategories() {
			try {
				const data = await getCategories()
				setCategories(data)
			} catch {
				toast.error(t('categoriesLoadError'))
			}
		}
		loadCategories()
	}, [])

	const handleSave = async () => {
		if (
			!formData.name ||
			!formData.descriptionRu ||
			!formData.descriptionEn ||
			!formData.descriptionUk ||
			formData.images.length === 0 ||
			formData.priceUSD <= 0 ||
			formData.priceEUR <= 0 ||
			formData.priceUAH <= 0
		) {
			toast.error(t('fillRequiredFields'))
			return
		}

		try {
			setIsSaving(true)

			if (mode === 'edit' && initialProduct) {
				await updateProduct(initialProduct.id, formData)
				toast.success(t('productUpdated'))
			} else {
				await createProduct(formData)
				toast.success(t('productCreated'))
			}

			setTimeout(() => router.push('/dashboard/admin/products'), 0)
		} catch (error: any) {
			toast.error(error.message || t('genericError'))
		} finally {
			setIsSaving(false)
		}
	}

	const handleUploadImages = async (files: FileList) => {
		try {
			const uploadedImages = await uploadImages(files)
			setFormData(prev => {
				const hasMainImage = prev.images.some(img => img.isMain)
				const newImages = uploadedImages.map((img, i) => ({
					...img,
					isMain: !hasMainImage && i === 0
				}))
				return { ...prev, images: [...prev.images, ...newImages] }
			})
			toast.success(t('imagesUploaded', { count: uploadedImages.length }))
		} catch {
			toast.error(t('imagesUploadFailed'))
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

	const mainImage =
		formData.images.find(img => img.isMain)?.url ||
		formData.images[0]?.url ||
		null

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<div className='sticky top-0 z-20 border-b bg-white/80 shadow-sm backdrop-blur-md'>
				<div className='mx-auto max-w-7xl px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<button
								onClick={() => router.push('/dashboard/admin/products')}
								className='rounded-lg p-2 transition-colors hover:bg-gray-100'
							>
								<ArrowLeft className='h-5 w-5' />
							</button>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									{mode === 'edit' ? 'Редактирование товара' : 'Новый товар'}
								</h1>
								<p className='text-sm text-gray-500'>
									{mode === 'edit'
										? 'Обновите информацию о товаре'
										: 'Создайте новый товар для магазина'}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								onClick={() => router.push('/dashboard/admin/products')}
								disabled={isSaving}
							>
								Отмена
							</Button>
							<Button
								onClick={handleSave}
								disabled={isSaving || isUploading}
								className='bg-pur hover:bg-purh'
							>
								{isSaving ? (
									<>
										<div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
										Сохранение...
									</>
								) : (
									<>
										<Save className='mr-2 h-4 w-4' />
										{mode === 'edit' ? 'Сохранить' : 'Создать товар'}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='mx-auto max-w-7xl px-6 py-8'>
				<div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
					<div className='space-y-6 lg:col-span-8'>
						{/* Основная информация */}
						<div className='overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md'>
							<div className='border-b bg-blue-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
									<Package className='h-5 w-5 text-blue-600' />
									Основная информация
								</h2>
							</div>
							<div className='space-y-6 p-6'>
								<div className='relative'>
									<Input
										value={formData.name}
										onChange={e =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder=' '
										className='peer pb-5 pt-8'
									/>
									<label className='absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600'>
										Название товара <span className='text-red-500'>*</span>
									</label>
								</div>

								<ProductPriceFields
									priceUSD={formData.priceUSD}
									priceEUR={formData.priceEUR}
									priceUAH={formData.priceUAH}
									onPriceChange={(currency, value) =>
										setFormData({ ...formData, [`price${currency}`]: value })
									}
								/>
							</div>
						</div>

						{/* Описание на 3 языках — вынесено в отдельный компонент */}
						<ProductDescriptionFields
							values={{
								descriptionRu: formData.descriptionRu,
								descriptionEn: formData.descriptionEn,
								descriptionUk: formData.descriptionUk
							}}
							onChange={(field, value) =>
								setFormData(prev => ({ ...prev, [field]: value }))
							}
						/>

						{/* Изображения */}
						<div className='overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md'>
							<div className='border-b bg-purple-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
									<Eye className='h-5 w-5 text-purple-600' />
									Изображения <span className='text-red-500'>*</span>
								</h2>
							</div>
							<div className='p-6'>
								<ImageUploader
									images={formData.images}
									onUpload={handleUploadImages}
									onImagesChange={(images: ProductImageDto[]) =>
										setFormData({ ...formData, images })
									}
									isUploading={isUploading}
								/>
							</div>
						</div>

						{/* SEO */}
						<div className='overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md'>
							<div className='border-b bg-orange-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
									<Tag className='h-5 w-5 text-orange-600' />
									SEO и поиск
								</h2>
							</div>
							<div className='space-y-4 p-6'>
								<div className='flex gap-2'>
									<Input
										value={keywordInput}
										onChange={e => setKeywordInput(e.target.value)}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault()
												handleAddKeyword()
											}
										}}
										placeholder='Добавьте ключевое слово...'
										className='flex-1'
									/>
									<Button
										type='button'
										onClick={handleAddKeyword}
										className='bg-pur hover:bg-purh'
									>
										Добавить
									</Button>
								</div>

								{formData.searchKeywords &&
									formData.searchKeywords.length > 0 && (
										<div className='flex flex-wrap gap-2'>
											{formData.searchKeywords.map((keyword, index) => (
												<span
													key={index}
													className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-all animate-in fade-in slide-in-from-bottom-2 hover:shadow-md'
												>
													{keyword}
													<button
														type='button'
														onClick={() => handleRemoveKeyword(index)}
														className='rounded-full p-0.5 transition hover:bg-blue-200'
													>
														<X className='h-3 w-3' />
													</button>
												</span>
											))}
										</div>
									)}

								<p className='text-xs text-gray-500'>
									Базовые ключевые слова генерируются автоматически. Добавьте
									синонимы, популярные варианты написания или маркетинговые
									термины
								</p>
							</div>
						</div>
					</div>

					{/* Правая колонка */}
					<div className='lg:col-span-4'>
						<div className='sticky top-24 space-y-6'>
							{/* Превью */}
							<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
								<div className='border-b bg-green-50 px-4 py-3'>
									<h3 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
										<Eye className='h-4 w-4 text-green-600' />
										Превью товара
									</h3>
								</div>
								<div className='p-4'>
									<div className='rounded-xl border bg-gray-50 p-4'>
										<div className='relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-200'>
											{mainImage ? (
												<Image
													src={mainImage}
													alt='Preview'
													fill
													className='object-cover'
												/>
											) : (
												<div className='flex h-full items-center justify-center text-gray-400'>
													<Package className='h-16 w-16' />
												</div>
											)}
										</div>
										<h4 className='line-clamp-2 font-semibold text-gray-900'>
											{formData.name || 'Название товара'}
										</h4>
										<p className='mt-1 line-clamp-2 text-sm text-gray-500'>
											{formData.descriptionRu || 'Описание товара...'}
										</p>
										<div className='mt-3 flex items-center justify-between'>
											<div>
												<span className='text-2xl font-bold'>
													${formData.priceUSD || '0'}
												</span>
												<div className='mt-1 text-xs text-gray-500'>
													€{formData.priceEUR || '0'} / ₴
													{formData.priceUAH || '0'}
												</div>
											</div>
											<span className='text-sm text-gray-500'>
												В наличии: {formData.quantity || 0}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Категория */}
							<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
								<div className='border-b px-4 py-3'>
									<h3 className='text-sm font-semibold text-gray-700'>
										Категория
									</h3>
								</div>
								<div className='p-4'>
									<select
										value={formData.categoryId || ''}
										onChange={e =>
											setFormData({
												...formData,
												categoryId: e.target.value
													? Number(e.target.value)
													: undefined
											})
										}
										className='w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
									>
										<option value=''>Без категории</option>
										{categories.map(cat => (
											<option key={cat.id} value={cat.id}>
												{cat.nameRu}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Видимость */}
							<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
								<div className='border-b px-4 py-3'>
									<h3 className='text-sm font-semibold text-gray-700'>
										Видимость
									</h3>
								</div>
								<div className='p-4'>
									<label className='flex cursor-pointer items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div
												className={`rounded-lg p-2 ${formData.isVisible ? 'bg-green-100' : 'bg-gray-100'}`}
											>
												{formData.isVisible ? (
													<Eye className='h-5 w-5 text-green-600' />
												) : (
													<EyeOff className='h-5 w-5 text-gray-600' />
												)}
											</div>
											<div>
												<p className='text-sm font-medium text-gray-900'>
													{formData.isVisible ? 'Товар видим' : 'Товар скрыт'}
												</p>
												<p className='text-xs text-gray-500'>
													{formData.isVisible
														? 'Отображается в магазине'
														: 'Скрыт от покупателей'}
												</p>
											</div>
										</div>
										<button
											type='button'
											onClick={() =>
												setFormData({
													...formData,
													isVisible: !formData.isVisible
												})
											}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
												formData.isVisible ? 'bg-green-600' : 'bg-gray-300'
											}`}
										>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
													formData.isVisible ? 'translate-x-6' : 'translate-x-1'
												}`}
											/>
										</button>
									</label>
									<div className='mt-3 rounded-lg bg-blue-50 p-3'>
										<p className='text-xs text-blue-700'>
											Скрытые товары не отображаются в каталоге, но доступны по
											прямой ссылке
										</p>
									</div>
								</div>
							</div>

							{/* Чеклист */}
							<div className='overflow-hidden rounded-2xl bg-blue-700 p-6 text-white shadow-lg'>
								<div className='mb-4 flex items-center gap-2'>
									<CheckCircle2 className='h-5 w-5' />
									<h3 className='font-semibold'>Готово к публикации?</h3>
								</div>
								<p className='mb-4 text-sm text-blue-100'>
									Проверьте все данные перед сохранением товара
								</p>
								<ul className='space-y-2 text-sm'>
									{[
										{ label: 'Название товара', ok: !!formData.name },
										{ label: 'Описание (RU)', ok: !!formData.descriptionRu },
										{ label: 'Description (EN)', ok: !!formData.descriptionEn },
										{ label: 'Опис (UK)', ok: !!formData.descriptionUk },
										{
											label: `Изображения (${formData.images.length})`,
											ok: formData.images.length > 0
										},
										{
											label: 'Цены (USD, EUR, UAH)',
											ok:
												formData.priceUSD > 0 &&
												formData.priceEUR > 0 &&
												formData.priceUAH > 0
										}
									].map(({ label, ok }) => (
										<li key={label} className='flex items-center gap-2'>
											<span
												className={`h-2 w-2 rounded-full ${ok ? 'bg-green-400' : 'bg-red-400'}`}
											/>
											{label}
										</li>
									))}
									<li className='flex items-center gap-2'>
										<span
											className={`h-2 w-2 rounded-full ${formData.isVisible ? 'bg-green-400' : 'bg-yellow-400'}`}
										/>
										Видимость: {formData.isVisible ? 'Видим' : 'Скрыт'}
									</li>
								</ul>
							</div>

							{mode === 'edit' && initialProduct && (
								<div className='overflow-hidden rounded-2xl border bg-white shadow-sm'>
									<div className='border-b bg-gray-50 px-4 py-3'>
										<h3 className='text-sm font-semibold text-gray-700'>
											Информация о товаре
										</h3>
									</div>
									<div className='space-y-3 p-4 text-sm'>
										{[
											{
												label: 'Товар создан',
												date: initialProduct.createdAt
											},
											{
												label: 'Последнее обновление',
												date: initialProduct.updatedAt
											}
										].map(({ label, date }, i) => (
											<div key={label} className={i > 0 ? 'border-t pt-3' : ''}>
												<p className='text-xs font-medium text-gray-500'>
													{label}
												</p>
												<p className='mt-1 font-semibold text-gray-900'>
													{new Date(date).toLocaleDateString('ru-RU', {
														day: 'numeric',
														month: 'long',
														year: 'numeric',
														hour: '2-digit',
														minute: '2-digit'
													})}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
