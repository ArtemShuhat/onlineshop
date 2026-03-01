import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class StripeService {
	private stripe: Stripe

	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaService
	) {
		this.stripe = new Stripe(this.config.getOrThrow('STRIPE_SECRET_KEY'), {
			apiVersion: '2025-12-15.clover'
		})
	}

	async createCheckoutSession(orderId: number, userId: string) {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId },
			include: {
				user: true
			}
		})

		if (!order || order.userId !== userId) {
			throw new Error('Заказ не найден')
		}

		if (order.totalPrice <= 0) {
			await this.prisma.order.update({
				where: { id: order.id },
				data: { status: 'PAYED' }
			})

			return {
				url: `${this.config.getOrThrow('ALLOWED_ORIGIN')}/orders/${orderId}?success=true`
			}
		}

		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: `Order #${order.id}`,
							description: order.promoCode
								? `Promo code: ${order.promoCode}`
								: undefined
						},
						unit_amount: order.totalPrice * 100
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${this.config.getOrThrow('ALLOWED_ORIGIN')}/orders/${orderId}?success=true`,
			cancel_url: `${this.config.getOrThrow('ALLOWED_ORIGIN')}/orders/${orderId}?canceled=true`,
			customer_email: order.user.email,
			metadata: {
				orderId: orderId.toString(),
				userId
			}
		})

		await this.prisma.order.update({
			where: { id: orderId },
			data: { stripeSessionId: session.id }
		})

		return { url: session.url }
	}

	async handleWebhook(payload: Buffer, signature: string) {
		const webhookSecret = this.config.getOrThrow('STRIPE_WEBHOOK_SECRET')

		let event: Stripe.Event

		try {
			event = this.stripe.webhooks.constructEvent(
				payload,
				signature,
				webhookSecret
			)
		} catch (err) {
			console.error('Webhook signature verification failed:', err.message)
			throw new Error(`Webhook signature verification failed: ${err.message}`)
		}

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session

			if (session.payment_status === 'paid') {
				const orderId = parseInt(session.metadata?.orderId || '0', 10)

				if (orderId) {
					await this.prisma.order.update({
						where: { id: orderId },
						data: { status: 'PAYED' }
					})
				}
			}
		}

		return { received: true }
	}
}
