'use client'

import { Product } from '@entities/product'
import { Button } from '@shared/ui'
import { Pencil, Trash2 } from 'lucide-react'

interface ProductsTableProps {
	products: Product[]
	onEdit: (product: Product) => void
	onDelete: (id: number) => void
}

export function ProductTable({
	products,
	onEdit,
	onDelete
}: ProductsTableProps) {
	if (products.length === 0) {
		return (
			<div className='rounded-lg bg-white py-12 text-center shadow'>
				<p className='text-gray-500'>Товаров пока нет</p>
				<p className='mt-2 text-sm text-gray-400'>Создайте первый товар!</p>
			</div>
		)
	}

	return (
		<div className='mb-7 overflow-hidden rounded-lg bg-white shadow'>
			<table className='w-full'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							ID
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							Название
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							Цена
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							Категория
						</th>
						<th className='px-6 py-3 text-right text-xs font-medium uppercase text-gray-500'>
							Действия
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200'>
					{products.map(product => (
						<tr key={product.id}>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
								{product.id}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
								{product.name}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
								{product.price} $
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
								{product.category?.name || '-'}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onEdit(product)}
								>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onDelete(product.id)}
								>
									<Trash2 className='h-4 w-4 text-red-500' />
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
