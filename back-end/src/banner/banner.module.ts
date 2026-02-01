import { Module } from '@nestjs/common'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { BannerController } from './banner.controller'
import { BannerService } from './banner.service'

@Module({
	controllers: [BannerController],
	providers: [BannerService, PrismaService, CloudinaryService, UserService]
})
export class BannerModule {}
