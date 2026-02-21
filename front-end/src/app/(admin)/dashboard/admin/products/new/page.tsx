'use client'

import { ProductForm } from '@features/admin-products'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
	return (
		<div className='mx-auto space-y-6'>
			<div className='flex items-center gap-4'>
				<Link
					href='/dashboard/admin/products'
					className='flex items-center text-sm text-gray-600 hover:text-gray-900'
				>
					<ChevronLeft className='mr-1 h-4 w-4' />
					Назад к товарам
				</Link>
			</div>

			<div className='rounded-lg border bg-white p-6 shadow-sm'>
				<h1 className='mb-6 text-2xl font-bold'>Создать товар</h1>
				<ProductForm mode='create' />
			</div>
		</div>
	)
}
