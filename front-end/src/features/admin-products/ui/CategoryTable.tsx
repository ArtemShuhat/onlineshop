'use client'

import { type Category } from '@entities/category'
import { SortDirection } from '@shared/hooks'
import { Button } from '@shared/ui'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

export type CategorySortColumn = 'id' | 'name' | 'createdAt'

interface CategoriesTableProps {
	categories: Category[]
	onEdit: (category: Category) => void
	onDelete: (id: number) => void
	sortColumn: CategorySortColumn
	sortDirection: SortDirection
	onSort: (column: CategorySortColumn) => void
}

export function CategoriesTable({
	categories,
	onEdit,
	onDelete,
	sortColumn,
	sortDirection,
	onSort
}: CategoriesTableProps) {
	const SortHeader = ({
		column,
		children
	}: {
		column: CategorySortColumn
		children: React.ReactNode
	}) => {
		const isActive = sortColumn === column
		return (
			<th
				className='cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 transition-colors hover:bg-gray-100'
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

	if (categories.length === 0) {
		return (
			<div className='rounded-lg bg-white py-12 text-center shadow'>
				<p className='text-gray-500'>Категорий пока нет</p>
				<p className='mt-2 text-sm text-gray-400'>Создайте первую категорию!</p>
			</div>
		)
	}

	return (
		<div className='mb-7 overflow-hidden rounded-lg bg-white shadow'>
			<table className='w-full'>
				<thead className='bg-gray-50'>
					<tr>
						<SortHeader column='id'>ID</SortHeader>
						<SortHeader column='name'>Название</SortHeader>
						<SortHeader column='createdAt'>Дата создания</SortHeader>
						<th className='px-6 py-3 text-right text-xs font-medium uppercase text-gray-500'>
							Действия
						</th>
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200'>
					{categories.map(category => (
						<tr key={category.id} className='transition hover:bg-gray-50'>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
								{category.id}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
								{category.name}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
								{new Date(category.createdAt).toLocaleDateString('ru-RU')}
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onEdit(category)}
								>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onDelete(category.id)}
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
