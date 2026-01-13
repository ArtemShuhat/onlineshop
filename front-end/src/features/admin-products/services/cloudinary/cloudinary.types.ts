export interface CloudinaryUploadOptions {
	file: File
	folder?: string
	maxSizeMB?: number
}

export interface CloudinaryUploadResult {
	url: string
	publicId: string
}
