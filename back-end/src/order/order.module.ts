import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CartModule } from '@/cart/cart.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserService } from '@/user/user.service'

import { OrderStatusService } from './order-status.service'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
	imports: [PrismaModule, CartModule, ScheduleModule.forRoot()],
	controllers: [OrderController],
	providers: [OrderService, OrderStatusService, UserService],
	exports: [OrderService]
})
export class OrderModule {}
