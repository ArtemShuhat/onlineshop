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
				orderItems: {
					include: {
						product: {
							select: {
								name: true,
								priceUSD: true,
								productImages: {
									where: { isMain: true },
									take: 1
								}
							}
						}
					}
				},
				user: true
			}
		})

		if (!order || order.userId !== userId) {
			throw new Error('Заказ не найден')
		}

		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
			order.orderItems.map(item => ({
				price_data: {
					currency: 'usd',
					product_data: {
						name: item.product.name,
						images: item.product.productImages[0]?.url
							? [item.product.productImages[0].url]
							: []
					},
					unit_amount: item.product.priceUSD * 100
				},
				quantity: item.quantity
			}))

		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${this.config.getOrThrow('ALLOWED_ORIGIN')}/orders/${orderId}?success=true`,
			cancel_url: `${this.config.getOrThrow('ALLOWED_ORIGIN')}/orders/${orderId}?canceled=true`,
			customer_email: order.user.email,
			metadata: {
				orderId: orderId.toString(),
				userId: userId
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

		console.log('Webhook event received:', event.type)

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session

			console.log('Session payment_status:', session.payment_status)
			console.log('Session metadata:', session.metadata)

			if (session.payment_status === 'paid') {
				const orderId = parseInt(session.metadata?.orderId || '0')

				console.log('Updating order:', orderId)

				if (orderId) {
					await this.prisma.order.update({
						where: { id: orderId },
						data: { status: 'PAYED' }
					})
					console.log('Order status updated to PAYED')
				}
			}
		}

		return { received: true }
	}
}
