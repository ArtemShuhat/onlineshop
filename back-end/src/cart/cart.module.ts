import { Module } from '@nestjs/common'

import { AnalyticsModule } from '@/analytics/analytics.module'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { CartController } from './cart.controller'
import { CartService } from './cart.service'

@Module({
	imports: [AnalyticsModule],
	controllers: [CartController],
	providers: [CartService, PrismaService, UserService],
	exports: [CartService]
})
export class CartModule {}
