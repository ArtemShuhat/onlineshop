import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService, PrismaService, CloudinaryService],
})
export class BannerModule {}
