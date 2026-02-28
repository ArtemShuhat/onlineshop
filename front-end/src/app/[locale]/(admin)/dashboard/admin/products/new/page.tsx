import { ProductForm } from '@features/admin-products'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
	return (
		<div className='mx-auto space-y-6'>
			<ProductForm mode='create' />
		</div>
	)
}
