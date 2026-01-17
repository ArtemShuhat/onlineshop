import { Injectable, Logger } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
	private readonly logger = new Logger(CloudinaryService.name)

	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET
		})

		this.logger.log(
			`Cloudinary configured: cloud_name=${process.env.CLOUDINARY_CLOUD_NAME}`
		)
	}

	extractPublicId(url: string): string | null {
		try {
			const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i
			const match = url.match(regex)

			this.logger.log(`extractPublicId: URL=${url}`)
			this.logger.log(
				`extractPublicId: public_id=${match ? match[1] : 'NOT FOUND'}`
			)

			return match ? match[1] : null
		} catch (error) {
			this.logger.error(`extractPublicId error: ${error}`)
			return null
		}
	}

	async deleteImage(url: string): Promise<boolean> {
		this.logger.log(`deleteImage called with URL: ${url}`)

		const publicId = this.extractPublicId(url)

		if (!publicId) {
			this.logger.warn(`Не удалось извлечь public_id из URL: ${url}`)
			return false
		}

		try {
			this.logger.log(`Attempting to delete from Cloudinary: ${publicId}`)
			const result = await cloudinary.uploader.destroy(publicId)
			this.logger.log(`Cloudinary response: ${JSON.stringify(result)}`)

			if (result.result === 'ok') {
				this.logger.log(`Successfully deleted: ${publicId}`)
				return true
			} else {
				this.logger.warn(`Delete failed for ${publicId}: ${result.result}`)
				return false
			}
		} catch (error) {
			this.logger.error(`Cloudinary delete error for ${publicId}:`, error)
			return false
		}
	}

	async deleteMultipleImages(urls: string[]): Promise<void> {
		this.logger.log(`deleteMultipleImages called with ${urls.length} URLs`)
		this.logger.log(`URLs: ${JSON.stringify(urls)}`)

		const deletePromises = urls.map(url => this.deleteImage(url))
		const results = await Promise.allSettled(deletePromises)

		this.logger.log(`Delete results: ${JSON.stringify(results)}`)
	}
}
