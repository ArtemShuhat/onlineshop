import { type Order, OrderStatusBadge } from '@entities/order'
import { getMainProductImage } from '@shared/lib'
import { cn } from '@shared/utils'
import { ArrowRight, Calendar, Package, ShoppingBag } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

interface OrderCardProps {
	order: Order
	onClick?: () => void
}

function getProductWord(count: number, t: (key: string) => string) {
	const n = Math.abs(count) % 100
	const n1 = n % 10

	if (n > 10 && n < 20) return t('productWord.many')
	if (n1 > 1 && n1 < 5) return t('productWord.few')
	if (n1 === 1) return t('productWord.one')
	return t('productWord.many')
}

export function OrderCard({ order, onClick }: OrderCardProps) {
	const t = useTranslations('orderCard')
	const locale = useLocale()
	const totalItems = order.orderItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	)

	const firstItem = order.orderItems[0]
	const remainingCount = order.orderItems.length - 1

	return (
		<div
			className='group grid cursor-pointer grid-rows-[auto_1fr_auto_auto] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl'
			onClick={onClick}
		>
			<div className='bg-gradient-to-br from-blue-50 via-white to-purple-50 p-5 pb-4'>
				<div className='flex items-start justify-between gap-3'>
					<div className='flex items-start gap-3'>
						<div className='rounded-xl bg-white p-2.5 shadow-sm'>
							<Package className='h-5 w-5 text-blue-600' />
						</div>
						<div>
							<h3 className='text-lg font-bold text-gray-900'>
								{t('orderNumber', { id: order.id })}
							</h3>
							<div className='mt-1 flex items-center gap-1.5 text-sm text-gray-600'>
								<Calendar className='h-3.5 w-3.5' />
								<span>
									{new Date(order.createdAt).toLocaleDateString(locale, {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</span>
							</div>
						</div>
					</div>
					<OrderStatusBadge status={order.status} />
				</div>
			</div>

			<div className='flex h-full flex-col gap-3'>
				<div
					className={cn(
						'flex flex-1 items-center px-5 pt-4',
						remainingCount > 0 ? 'justify-start' : 'justify-center'
					)}
				>
					<div className='flex w-full items-center gap-4 rounded-xl bg-gray-50 p-4'>
						{getMainProductImage(firstItem.product.productImages) && (
							<div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-md'>
								<Image
									src={getMainProductImage(firstItem.product.productImages)!}
									alt={firstItem.product.name}
									fill
									className='object-cover'
								/>
							</div>
						)}

						<div className='min-w-0 flex-1'>
							<h4 className='line-clamp-2 font-semibold text-gray-900'>
								{firstItem.product.name}
							</h4>

							<div className='mt-1.5 flex items-center gap-3 text-sm'>
								<span className='text-gray-600'>
									{t('quantity')}:{' '}
									<span className='font-medium text-gray-900'>
										{firstItem.quantity}
									</span>
								</span>

								<span className='text-gray-400'>•</span>

								<span className='font-bold text-blue-600'>
									${firstItem.amountItem}
								</span>
							</div>
						</div>
					</div>
				</div>
				{remainingCount > 0 && (
					<div className='px-5 pb-4'>
						<div className='flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3'>
							<ShoppingBag className='h-4 w-4 text-blue-700' />
							<span className='text-sm font-semibold text-blue-700'>
								{t('moreItems', {
									count: remainingCount,
									word: getProductWord(remainingCount, t)
								})}
							</span>
						</div>
					</div>
				)}
			</div>
			<div className='border-t border-gray-100 bg-gray-50 px-5 py-4'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
							{t('total')}
						</p>
						<div className='mt-1 flex items-baseline gap-2'>
							<p className='text-3xl font-bold text-gray-900'>
								${order.totalPrice}
							</p>
							<span className='text-sm font-medium text-gray-500'>
								{totalItems} {getProductWord(totalItems, t)}
							</span>
						</div>
					</div>

					<button className='flex items-center gap-2 rounded-xl bg-pur px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl group-hover:gap-3'>
						<span>{t('details')}</span>
						<ArrowRight className='h-4 w-4' />
					</button>
				</div>
			</div>
		</div>
	)
}
