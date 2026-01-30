import { Injectable, NotFoundException } from '@nestjs/common'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto'

@Injectable()
export class BannerService {
	constructor(
		private prisma: PrismaService,
		private cloudinary: CloudinaryService
	) {}

	async findAll() {
		return this.prisma.banner.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' }
		})
	}

	async findAllAdmin() {
		return this.prisma.banner.findMany({
			orderBy: { order: 'asc' }
		})
	}

	async create(dto: CreateBannerDto) {
		const maxOrder = await this.prisma.banner.aggregate({
			_max: { order: true }
		})

		return this.prisma.banner.create({
			data: {
				url: dto.url,
				order: dto.order ?? (maxOrder._max.order ?? 0) + 1
			}
		})
	}

	async update(id: number, dto: UpdateBannerDto) {
		const banner = await this.prisma.banner.findUnique({
			where: { id }
		})

		if (!banner) {
			throw new NotFoundException('Баннер не найден')
		}

		return this.prisma.banner.update({
			where: { id },
			data: dto
		})
	}

	async delete(id: number) {
		const banner = await this.prisma.banner.findUnique({
			where: { id }
		})

		if (!banner) {
			throw new NotFoundException('Баннер не найден')
		}

		await this.cloudinary.deleteImage(banner.url)

		return this.prisma.banner.delete({ where: { id } })
	}

	async reorder(bannerIds: number[]) {
		const updates = bannerIds.map((id, index) =>
			this.prisma.banner.update({
				where: { id },
				data: { order: index }
			})
		)

		return this.prisma.$transaction(updates)
	}
}
