import { OrderDetailsPageClient } from '@features/order-details'

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

	return <OrderDetailsPageClient orderId={orderId} />
}
