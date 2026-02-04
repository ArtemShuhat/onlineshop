'use client'

import { Product, toggleProductVisibility } from '@entities/product'
import { Button } from '@shared/ui'
import { Eye, EyeOff, Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductsTableProps {
	products: Product[]
	onEdit: (product: Product) => void
	onUpdate: () => void
}

export function ProductTable({
	products,
	onEdit,
	onUpdate
}: ProductsTableProps) {
	const [togglingId, setTogglingId] = useState<number | null>(null)

	const handleToggleVisibility = async (productId: number) => {
		try {
			setTogglingId(productId)
			await toggleProductVisibility(productId)
			toast.success('Статус товара изменен')
			onUpdate()
		} catch (error) {
			toast.error('Ошибка изменения статуса')
		} finally {
			setTogglingId(null)
		}
	}

	if (products.length === 0) {
		return (
			<div className='rounded-lg bg-white py-12 text-center shadow'>
				<p className='text-gray-500'>Товаров пока нет</p>
				<p className='mt-2 text-sm text-gray-400'>Создайте первый товар!</p>
			</div>
		)
	}

	return (
		<div className='overflow-x-auto rounded-lg bg-white shadow'>
			<table className='w-full'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							ID
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							Название
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							Цена
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							Категория
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							Статус
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
							Действия
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200 bg-white'>
					{products.map(product => (
						<tr
							key={product.id}
							className={!product.isVisible ? 'bg-gray-50' : ''}
						>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
								{product.id}
							</td>
							<td className='px-6 py-4 text-sm font-medium text-gray-900'>
								{product.name}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
								{product.price} $
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
								{product.category?.name || '-'}
							</td>
							<td className='whitespace-nowrap px-6 py-4'>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										product.isVisible
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-gray-800'
									}`}
								>
									{product.isVisible ? 'Видим' : 'Скрыт'}
								</span>
							</td>
							<td className='whitespace-nowrap px-6 py-4'>
								<button
									onClick={() => onEdit(product)}
									className='mr-2 text-blue-600 hover:text-blue-800'
									title='Редактировать'
								>
									<Pencil className='inline h-4 w-4' />
								</button>
								<button
									onClick={() => handleToggleVisibility(product.id)}
									disabled={togglingId === product.id}
									className='text-orange-600 hover:text-orange-800 disabled:opacity-50'
									title={product.isVisible ? 'Скрыть товар' : 'Показать товар'}
								>
									{product.isVisible ? (
										<EyeOff className='inline h-4 w-4' />
									) : (
										<Eye className='inline h-4 w-4' />
									)}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
