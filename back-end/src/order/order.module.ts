import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CartModule } from '@/cart/cart.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { PromoCodeModule } from '@/promo-code/promo-code.module'
import { UserService } from '@/user/user.service'

import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
	imports: [
		PrismaModule,
		CartModule,
		PromoCodeModule,
		ScheduleModule.forRoot()
	],
	controllers: [OrderController],
	providers: [OrderService, UserService],
	exports: [OrderService]
})
export class OrderModule {}
