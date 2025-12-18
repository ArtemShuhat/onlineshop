'use client'

import { Product } from '@entities/api/productsApi'
import { useState } from 'react'

interface ProductTabsProps {
	product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState('description')

	const tabs = [
		{ id: 'description', label: 'Описание' },
		{ id: 'specification', label: 'Характеристики' },
		{ id: 'reviews', label: 'Отзывы' }
	]

	return (
		<div className='pt-8'>
			<div className='flex gap-8 border-b'>
				{tabs.map(tab => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-2 pb-4 font-medium transition ${
							activeTab === tab.id
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='py-8'>
				{activeTab === 'description' && (
					<div className='prose max-w-none'>
						<h3 className='mb-4 text-xl font-semibold'>Описание товара</h3>
						<p className='leading-relaxed text-gray-700'>
							{product.description}
						</p>
					</div>
				)}

				{activeTab === 'specification' && (
					<div className='space-y-3'>
						<h3 className='mb-4 text-xl font-semibold'>Характеристики</h3>
						<div className='grid grid-cols-2 gap-4'>
							<div className='border-b pb-2'>
								<span className='text-gray-600'>Название:</span>
								<span className='ml-2 font-medium'>{product.name}</span>
							</div>
							<div className='border-b pb-2'>
								<span className='text-gray-600'>Цена:</span>
								<span className='ml-2 font-medium'>${product.price}</span>
							</div>
							<div className='border-b pb-2'>
								<span className='text-gray-600'>Категория:</span>
								<span className='ml-2 font-medium'>
									{product.category?.name || '-'}
								</span>
							</div>
							<div className='border-b pb-2'>
								<span className='text-gray-600'>Наличие:</span>
								<span className='ml-2 font-medium'>{product.quantity} шт.</span>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'reviews' && (
					<div className='py-12 text-center text-gray-500'>
						<p>Отзывов пока нет</p>
						<p className='mt-2 text-sm'>Станьте первым, кто оставит отзыв!</p>
					</div>
				)}
			</div>
		</div>
	)
}
