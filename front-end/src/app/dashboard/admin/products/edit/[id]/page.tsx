'use client'

import { useProductById } from '@entities/product'
import { ProductForm } from '@features/admin-products'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function EditProductPage() {
	const params = useParams()
	const productId = Number(params.id)

	const { data: product, isLoading, error } = useProductById(productId)

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-gray-400' />
			</div>
		)
	}

	if (error || !product) {
		return (
			<div className='flex min-h-screen items-center'>
				<div className='mx-auto max-w-4xl space-y-6'>
					<div className='min-w-[300px] rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>
						<p className='flex justify-center text-2xl font-bold'>
							Товар не найден
						</p>
						<Link
							href='/dashboard/admin/products'
							className='mt-3 flex items-center justify-center text-sm text-red-600 hover:text-red-800'
						>
							<ChevronLeft className='mr-1 h-4 w-4' />
							Вернуться к товарам
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-[1280px] space-y-6'>
			<div className='flex items-center justify-between'>
				<Link
					href='/dashboard/admin/products'
					className='flex items-center text-sm text-gray-600 hover:text-gray-900'
				>
					<ChevronLeft className='mr-1 h-4 w-4' />
					Назад к товарам
				</Link>
			</div>

			<div className='rounded-lg border bg-white p-6 shadow-sm'>
				<h1 className='mb-6 text-2xl font-bold'>Редактировать товар</h1>
				<ProductForm mode='edit' initialProduct={product} />
			</div>
		</div>
	)
}
