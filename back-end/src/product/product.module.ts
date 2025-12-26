import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import { AnalyticsModule } from '@/analytics/analytics.module'
import { UserService } from '@/user/user.service'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	imports: [AnalyticsModule],
	controllers: [ProductController],
	providers: [ProductService, PrismaService, UserService],
	exports: [ProductService]
})
export class ProductModule {}
