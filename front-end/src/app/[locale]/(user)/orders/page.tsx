import { OrdersPageClient } from '@widgets/orders-page'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
	return <OrdersPageClient initialOrders={[]} />
}
