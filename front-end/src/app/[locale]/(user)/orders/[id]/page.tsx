import { getOrderById } from '@entities/order'
import { OrderDetailsToast } from '@features/handle-order-payment'
import { OrderDetailsContent } from '@features/order-details'
import { getServerCookieHeader } from '@shared/lib/getServerCookieHeader'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Props = {
	params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: Props) {
	const { id } = await params
	const orderId = Number(id)

	if (!Number.isFinite(orderId)) {
		return null
	}

	const cookieHeader = await getServerCookieHeader()
	const requestInit: RequestInit = {
		cache: 'no-store',
		...(cookieHeader.cookie ? { headers: { cookie: cookieHeader.cookie } } : {})
	}

	try {
		const order = await getOrderById(orderId, requestInit)

		return (
			<>
				<OrderDetailsToast orderId={orderId} />
				<OrderDetailsContent order={order} />
			</>
		)
	} catch {
		return (
			<div className='flex min-h-[70vh] items-center justify-center px-4'>
				<div className='text-center'>
					<XCircle className='mx-auto h-10 w-10 text-red-600' />
					<h1 className='mb-2 mt-4 text-2xl font-bold text-gray-900'>
						Заказ не найден
					</h1>
					<Link
						href='/orders'
						className='inline-flex rounded-full bg-pur px-6 py-3 text-white'
					>
						Вернуться к заказам
					</Link>
				</div>
			</div>
		)
	}
}
