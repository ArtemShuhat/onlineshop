import type { CloudinaryUploadOptions } from './cloudinary.types'

const MAX_FILE_SIZE_MB = 5

export async function uploadToCloudinary(
	options: CloudinaryUploadOptions
): Promise<string> {
	const { file, folder = 'products', maxSizeMB = MAX_FILE_SIZE_MB } = options

	if (file.size > maxSizeMB * 1024 * 1024) {
		throw new Error(
			`Файл ${file.name} слишком большой. Максимум ${maxSizeMB}MB`
		)
	}

	const formData = new FormData()
	formData.append('file', file)
	formData.append(
		'upload_preset',
		process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
	)
	formData.append('folder', folder)

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

export async function uploadMultipleToCloudinary(
	files: File[],
	folder?: string
): Promise<string[]> {
	const uploadPromises = files.map(file => uploadToCloudinary({ file, folder }))

	return Promise.all(uploadPromises)
}
