import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { OrderStatus } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class OrderStatusService {
	private readonly logger = new Logger(OrderStatusService.name)

	constructor(private readonly prisma: PrismaService) {}

	@Cron(CronExpression.EVERY_10_SECONDS)
	async processPendingOrders() {
		try {
			const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

			const pendingOrders = await this.prisma.order.findMany({
				where: {
					status: OrderStatus.PENDING,
					createdAt: {
						lte: oneMinuteAgo
					}
				}
			})

			if (pendingOrders.length > 0) {
				this.logger.log(
					`Найдено ${pendingOrders.length} заказов для обновления статуса`
				)

				for (const order of pendingOrders) {
					await this.prisma.order.update({
						where: { id: order.id },
						data: {
							status: OrderStatus.PAYED
						}
					})

					this.logger.log(`Статус заказа #${order.id} измененно на PAYED`)
				}
			}
		} catch (error) {
			this.logger.error('Ошибка при обработке PENDING заказов', error)
		}
	}
}
