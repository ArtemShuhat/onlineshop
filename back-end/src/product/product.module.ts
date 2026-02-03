import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import { AnalyticsModule } from '@/analytics/analytics.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { UserService } from '@/user/user.service'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { MeilisearchModule } from '@/meilisearch/meilisearch.module'
import { SearchModule } from '@/search/search.module'

@Module({
	imports: [AnalyticsModule, CloudinaryModule, MeilisearchModule, SearchModule],
	controllers: [ProductController],
	providers: [ProductService, PrismaService, UserService],
	exports: [ProductService]
})
export class ProductModule {}
