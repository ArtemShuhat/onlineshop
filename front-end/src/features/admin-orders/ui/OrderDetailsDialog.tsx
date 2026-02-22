'use client'

import { Order, OrderStatus, OrderStatusBadge } from '@entities/order'
import { getMainProductImage } from '@shared/lib'
import { Dialog, DialogContent } from '@shared/ui'
import {
	Calendar,
	Mail,
	MapPin,
	MessageSquare,
	Package,
	Receipt,
	ShoppingBag,
	User
} from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

interface OrderDetailsDialogProps {
	onClose: () => void
	order: Order | null
}

const statusConfig = {
	[OrderStatus.PENDING]: {
		color: 'from-orange-500 to-yellow-500',
		icon: 'P'
	},
	[OrderStatus.PAYED]: {
		color: 'from-green-700 via-emerald-600 to-emerald-500',
		icon: 'OK'
	},
	[OrderStatus.SHIPPED]: {
		color: 'from-blue-500 to-cyan-500',
		icon: 'TR'
	},
	[OrderStatus.DELIVERED]: {
		color: 'from-purple-500 to-pink-500',
		icon: 'DN'
	}
}

export function OrderDetailsDialog({
	order,
	onClose
}: OrderDetailsDialogProps) {
	const t = useTranslations('adminOrderDetailsDialog')
	const locale = useLocale()
	const isOpen = order !== null

	if (!order) return null

	const config = statusConfig[order.status]
	const dateLocale = locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US'

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl [&_svg]:stroke-[2.5]'>
				<div
					className={`relative overflow-hidden bg-gradient-to-br ${config.color} px-8 py-6`}
				>
					<div className='relative'>
						<div className='mb-2 flex items-center gap-3'>
							<div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-base font-bold backdrop-blur-md'>
								{config.icon}
							</div>
							<div>
								<h2 className='text-3xl font-bold text-white'>
									{t('orderTitle', { id: order.id })}
								</h2>
								<p className='text-sm text-white/80'>
									{new Date(order.createdAt).toLocaleDateString(dateLocale, {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</p>
							</div>
						</div>
						<div className='mt-4'>
							<OrderStatusBadge status={order.status} />
						</div>
					</div>
				</div>

				<div className='max-h-[calc(90vh-200px)] overflow-y-auto p-8'>
					<div className='space-y-6'>
						<div className='grid gap-6 md:grid-cols-2'>
							<div className='overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50'>
								<div className='border-b bg-white/50 px-4 py-3'>
									<h3 className='flex items-center gap-2 font-semibold text-gray-900'>
										<User className='h-5 w-5 text-blue-600' />
										{t('clientInfo')}
									</h3>
								</div>
								<div className='space-y-3 p-4'>
									<div className='flex items-start gap-3'>
										<div className='mt-0.5 rounded-lg bg-white p-2 shadow-sm'>
											<User className='h-4 w-4 text-blue-600' />
										</div>
										<div>
											<p className='text-xs text-gray-500'>{t('nameLabel')}</p>
											<p className='font-medium text-gray-900'>
												{order.firstName}
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<div className='mt-0.5 rounded-lg bg-white p-2 shadow-sm'>
											<Mail className='h-4 w-4 text-blue-600' />
										</div>
										<div>
											<p className='text-xs text-gray-500'>{t('emailLabel')}</p>
											<p className='font-medium text-gray-900'>{order.email}</p>
										</div>
									</div>
								</div>
							</div>

							<div className='overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50'>
								<div className='border-b bg-white/50 px-4 py-3'>
									<h3 className='flex items-center gap-2 font-semibold text-gray-900'>
										<MapPin className='h-5 w-5 text-purple-600' />
										{t('shippingInfo')}
									</h3>
								</div>
								<div className='space-y-3 p-4'>
									<div className='flex items-start gap-3'>
										<div className='mt-0.5 rounded-lg bg-white p-2 shadow-sm'>
											<MapPin className='h-4 w-4 text-purple-600' />
										</div>
										<div>
											<p className='text-xs text-gray-500'>{t('cityLabel')}</p>
											<p className='font-medium text-gray-900'>
												{order.shippingCity}
											</p>
										</div>
									</div>
									<div className='flex items-start gap-3'>
										<div className='mt-0.5 rounded-lg bg-white p-2 shadow-sm'>
											<Package className='h-4 w-4 text-purple-600' />
										</div>
										<div>
											<p className='text-xs text-gray-500'>{t('addressLabel')}</p>
											<p className='font-medium text-gray-900'>
												{order.shippingAddress}
											</p>
											<p className='text-sm text-gray-600'>
												{order.shippingPostalCode}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{order.notes && (
							<div className='overflow-hidden rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50'>
								<div className='border-b bg-white/50 px-4 py-3'>
									<h3 className='flex items-center gap-2 font-semibold text-gray-900'>
										<MessageSquare className='h-5 w-5 text-amber-600' />
										{t('orderNotes')}
									</h3>
								</div>
								<div className='p-4'>
									<p className='text-gray-700'>{order.notes}</p>
								</div>
							</div>
						)}

						<div className='overflow-hidden rounded-xl border bg-white'>
							<div className='border-b bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3'>
								<h3 className='flex items-center gap-2 font-semibold text-gray-900'>
									<ShoppingBag className='h-5 w-5 text-emerald-600' />
									{t('itemsTitle', { count: order.orderItems.length })}
								</h3>
							</div>
							<div className='divide-y'>
								{order.orderItems.map(item => (
									<div
										key={item.id}
										className='flex items-center gap-4 p-4 transition-colors hover:bg-gray-50'
									>
										<div className='relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100 shadow-sm'>
											{getMainProductImage(item.product.productImages) ? (
												<Image
													src={getMainProductImage(item.product.productImages)!}
													alt={item.product.name}
													fill
													className='object-cover'
												/>
											) : (
												<div className='flex h-full w-full items-center justify-center'>
													<Package className='h-8 w-8 text-gray-400' />
												</div>
											)}
										</div>
										<div className='flex-1'>
											<p className='font-semibold text-gray-900'>
												{item.product.name}
											</p>
											<div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
												<span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'>
													${item.unitPrice}
												</span>
												<span className='text-gray-400'>x</span>
												<span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
													{t('quantityUnit', { count: item.quantity })}
												</span>
											</div>
										</div>

										<div className='text-right'>
											<p className='text-xl font-bold text-gray-900'>
												${item.amountItem}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='overflow-hidden rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'>
							<div className='p-6'>
								<div className='mb-4 flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='rounded-xl bg-emerald-500 p-3 shadow-lg'>
											<Receipt className='h-6 w-6 text-white' />
										</div>
										<div>
											<p className='text-sm text-gray-600'>{t('orderTotal')}</p>
											<p className='text-3xl font-bold text-emerald-600'>
												${order.totalPrice}
											</p>
										</div>
									</div>
								</div>

								<div className='flex items-center gap-4 border-t border-emerald-200 pt-4 text-sm text-gray-600'>
									<div className='flex items-center gap-1.5'>
										<Calendar className='h-4 w-4' />
										<span>
											{new Date(order.createdAt).toLocaleDateString(dateLocale)}
										</span>
									</div>
									<div className='h-4 w-px bg-gray-300' />
									<div className='flex items-center gap-1.5'>
										<Package className='h-4 w-4' />
										<span>{t('itemsCount', { count: order.orderItems.length })}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
