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
		<div className='mb-7 overflow-x-auto rounded-lg bg-white shadow'>
			<div className='inline-block min-w-full align-middle'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								ID
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Название
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Цена
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Категория
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								Статус
							</th>
							<th className='px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
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
								<td className='whitespace-nowrap px-3 py-3 text-sm text-gray-900'>
									{product.id}
								</td>
								<td className='px-4 py-3 text-sm font-medium text-gray-900'>
									<div className='max-w-xs truncate'>{product.name}</div>
								</td>
								<td className='whitespace-nowrap px-3 py-3 text-sm text-gray-900'>
									{product.price} $
								</td>
								<td className='whitespace-nowrap px-3 py-3 text-sm text-gray-500'>
									{product.category?.name || '-'}
								</td>
								<td className='whitespace-nowrap px-3 py-3 text-sm'>
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
								<td className='whitespace-nowrap px-3 py-3 text-right text-sm font-medium'>
									<div className='flex justify-end gap-1'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => onEdit(product)}
											title='Редактировать'
										>
											<Pencil className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleToggleVisibility(product.id)}
											disabled={togglingId === product.id}
											title={
												product.isVisible ? 'Скрыть товар' : 'Показать товар'
											}
										>
											{product.isVisible ? (
												<EyeOff className='h-4 w-4 text-orange-500' />
											) : (
												<Eye className='h-4 w-4 text-green-500' />
											)}
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
