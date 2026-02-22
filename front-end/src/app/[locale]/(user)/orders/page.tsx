import { type Order, getUserOrders } from '@entities/order'
import { getServerCookieHeader } from '@shared/lib/getServerCookieHeader'
import { OrdersPageClient } from '@widgets/orders-page'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
	const cookieHeader = await getServerCookieHeader()
	const requestInit: RequestInit = {
		cache: 'no-store',
		...(cookieHeader.cookie ? { headers: { cookie: cookieHeader.cookie } } : {})
	}

	let orders: Order[] = []
	try {
		orders = await getUserOrders(requestInit)
	} catch {
		orders = []
	}

	return <OrdersPageClient initialOrders={orders} />
}
