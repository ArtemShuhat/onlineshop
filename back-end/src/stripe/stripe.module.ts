import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OrderModule } from '@/order/order.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserService } from '@/user/user.service'

import { StripeController } from './stripe.controller'
import { StripeService } from './stripe.service'

@Module({
	imports: [ConfigModule, PrismaModule, OrderModule],
	controllers: [StripeController],
	providers: [StripeService, UserService],
	exports: [StripeService]
})
export class StripeModule {}
