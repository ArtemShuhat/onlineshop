'use client'

import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/shared/ui/Button'

import { type Category } from '@/entities/api/categories'

interface CategoriesTableProps {
	categories: Category[]
	onEdit: (category: Category) => void
	onDelete: (id: number) => void
}

export default function CategoriesTable({
	categories,
	onEdit,
	onDelete
}: CategoriesTableProps) {
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
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							ID
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							Название
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-500'>
							Дата создания
						</th>
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
