'use client'

import { Product, toggleProductVisibility } from '@entities/product'
import { SortDirection } from '@shared/hooks'
import { getMainProductImage } from '@shared/lib'
import { Button } from '@shared/ui'
import { ArrowUpDown, Eye, EyeOff, Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export type ProductSortColumn = 'id' | 'name' | 'price' | 'category'

interface ProductsTableProps {
	products: Product[]
	onEdit: (product: Product) => void
	onUpdate: () => void
	sortColumn: ProductSortColumn
	sortDirection: SortDirection
	onSort: (column: ProductSortColumn) => void
}

export function ProductTable({
	products,
	onEdit,
	onUpdate,
	sortColumn,
	sortDirection,
	onSort
}: ProductsTableProps) {
	const t = useTranslations('adminProductTableToasts')
	const [togglingId, setTogglingId] = useState<number | null>(null)

	const handleToggleVisibility = async (productId: number) => {
		try {
			setTogglingId(productId)
			await toggleProductVisibility(productId)
			toast.success(t('statusChanged'))
			onUpdate()
		} catch (error) {
			toast.error(t('statusChangeFailed'))
		} finally {
			setTogglingId(null)
		}
	}

	const SortHeader = ({
		column,
		children
	}: {
		column: ProductSortColumn
		children: React.ReactNode
	}) => {
		const isActive = sortColumn === column
		return (
			<th
				className='cursor-pointer px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-100'
				onClick={() => onSort(column)}
			>
				<div className='flex items-center gap-1.5'>
					{children}
					<ArrowUpDown
						className={`h-3.5 w-3.5 transition-all ${
							isActive
								? sortDirection === 'desc'
									? 'rotate-180 text-gray-700'
									: 'text-gray-700'
								: 'text-gray-400'
						}`}
					/>
				</div>
			</th>
		)
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
							<SortHeader column='id'>ID</SortHeader>
							<SortHeader column='name'>Название</SortHeader>
							<SortHeader column='price'>Цена</SortHeader>
							<SortHeader column='category'>Категория</SortHeader>
							<th className='px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'>
								Статус
							</th>
							<th className='px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700'>
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
								<td className='whitespace-nowrap py-3 pl-6 text-sm font-semibold text-gray-900'>
									{product.id}
								</td>
								<td className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-900'>
									{getMainProductImage(product.productImages) && (
										<Image
											src={getMainProductImage(product.productImages)!}
											alt={product.name}
											width={48}
											height={48}
											className='rounded-lg object-cover'
										/>
									)}
									<div className='max-w-xs truncate'>{product.name}</div>
								</td>
								<td className='whitespace-nowrap px-3 py-3 text-sm font-semibold text-gray-900'>
									{product.priceUSD} $
								</td>
								<td className='whitespace-nowrap px-3 py-3 text-sm font-semibold text-gray-700'>
									{product.category?.nameRu || '-'}
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
