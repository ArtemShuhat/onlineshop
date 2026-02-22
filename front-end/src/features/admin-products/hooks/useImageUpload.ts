'use client'

import type { ProductImageDto } from '@entities/product'
import { uploadToCloudinary } from '@features/admin-products'
import { useState } from 'react'

export function useImageUpload() {
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

			for (let i = 0; i < fileArray.length; i++) {
				const file = fileArray[i]

				try {
					const url = await uploadToCloudinary({ file })
					uploadedUrls.push({
						url,
						isMain: false
					})

					setUploadProgress(((i + 1) / fileArray.length) * 100)
				} catch (error) {
					console.error(`Ошибка загрузки ${file.name}:`, error)
				}
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
