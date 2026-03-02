'use client'

import type { ProductImageDto } from '@entities/product'
import { uploadToCloudinary } from '@features/admin-products'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export function useImageUpload() {
	const t = useTranslations('adminProductFormToasts')
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)

	const uploadImages = async (
		files: FileList | File[]
	): Promise<ProductImageDto[]> => {
		setIsUploading(true)
		setUploadProgress(0)

		try {
			const fileArray = Array.from(files)
			const uploadedUrls: ProductImageDto[] = []
			const failedFiles: string[] = []

			for (let i = 0; i < fileArray.length; i++) {
				const file = fileArray[i]

				try {
					const url = await uploadToCloudinary({ file })
					uploadedUrls.push({
						url,
						isMain: false
					})

					setUploadProgress(((i + 1) / fileArray.length) * 100)
				} catch {
					failedFiles.push(file.name)
				}
			}

			if (failedFiles.length > 0) {
				const visibleFiles = failedFiles.slice(0, 3).join(', ')
				const hiddenFilesCount = failedFiles.length - 3

				toast.warning(t('imagesPartialUpload', { count: failedFiles.length }), {
					id: 'admin-product-image-upload-warning',
					description:
						hiddenFilesCount > 0
							? t('imagesPartialUploadDescriptionMore', {
									files: visibleFiles,
									count: hiddenFilesCount
								})
							: t('imagesPartialUploadDescription', {
									files: visibleFiles
								})
				})
			}

			return uploadedUrls
		} finally {
			setIsUploading(false)
			setUploadProgress(0)
		}
	}

	return {
		uploadImages,
		isUploading,
		uploadProgress
	}
}
