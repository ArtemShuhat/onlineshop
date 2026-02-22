import { getProductById } from '@entities/product'
import { ProductForm } from '@features/admin-products'
import { getServerCookieHeader } from '@shared/lib/getServerCookieHeader'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Props = {
	params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
	const { id } = await params
	const productId = Number(id)

	if (!Number.isFinite(productId)) {
		return null
	}

	const cookieHeader = await getServerCookieHeader()
	const requestInit: RequestInit = {
		cache: 'no-store',
		...(cookieHeader.cookie ? { headers: { cookie: cookieHeader.cookie } } : {})
	}

	try {
		const product = await getProductById(productId, requestInit)

		return (
			<div className='max-w-[1280px] space-y-6'>
				<ProductForm mode='edit' initialProduct={product} />
			</div>
		)
	} catch {
		return (
			<div className='flex min-h-screen items-center'>
				<div className='mx-auto max-w-4xl space-y-6'>
					<div className='min-w-[300px] rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>
						<p className='flex justify-center text-2xl font-bold'>
							Product not found
						</p>
						<Link
							href='/dashboard/admin/products'
							className='mt-3 flex items-center justify-center text-sm text-red-600 hover:text-red-800'
						>
							<ChevronLeft className='mr-1 h-4 w-4' />
							Back to products
						</Link>
					</div>
				</div>
			</div>
		)
	}
}
