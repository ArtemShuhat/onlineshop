'use client'

import { type TopProduct } from '@entities/api/analyticsApi'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@shared/components/ui/tabs'
import { Award, Eye, ShoppingBag, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface TopProductsSectionProps {
	viewsData: TopProduct[]
	salesData: TopProduct[]
	revenueData: TopProduct[]
}

export function TopProductsSection({
	viewsData,
	salesData,
	revenueData
}: TopProductsSectionProps) {
	const [activeTab, setActiveTab] = useState<'views' | 'sales' | 'revenue'>(
		'views'
	)

	const getCurrentData = () => {
		switch (activeTab) {
			case 'views':
				return viewsData
			case 'sales':
				return salesData
			case 'revenue':
				return revenueData
		}
	}

	const getMetricValue = (product: TopProduct) => {
		switch (activeTab) {
			case 'views':
				return product.totalViews.toLocaleString()
			case 'sales':
				return product.totalSold.toLocaleString()
			case 'revenue':
				return `$${product.totalRevenue.toLocaleString()}`
		}
	}

	return (
		<div className='rounded-lg border bg-white shadow-sm'>
			<div className='border-b px-6 py-4'>
				<h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
					<Award className='h-5 w-5 text-yellow-500' />
					Топ товаров
				</h3>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={value => setActiveTab(value as any)}
				className='p-6'
			>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='views' className='flex items-center gap-2'>
						<Eye className='h-4 w-4' />
						Просмотры
					</TabsTrigger>
					<TabsTrigger value='sales' className='flex items-center gap-2'>
						<ShoppingBag className='h-4 w-4' />
						Продажи
					</TabsTrigger>
					<TabsTrigger value='revenue' className='flex items-center gap-2'>
						<TrendingUp className='h-4 w-4' />
						Выручка
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className='mt-6'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='border-b text-left text-sm font-medium text-gray-500'>
								<tr>
									<th className='pb-3 pl-4'>#</th>
									<th className='pb-3'>Товар</th>
									<th className='pb-3'>Категория</th>
									<th className='pb-3'>Цена</th>
									<th className='pb-3 text-center'>
										<Eye className='inline h-4 w-4' />
									</th>
									<th className='pb-3 text-center'>
										<ShoppingBag className='inline h-4 w-4' />
									</th>
									<th className='pb-3 pr-4 text-right font-semibold text-gray-900'>
										{activeTab === 'views'
											? 'Просмотры'
											: activeTab === 'sales'
												? 'Продажи'
												: 'Выручка'}
									</th>
								</tr>
							</thead>
							<tbody className='divide-y'>
								{getCurrentData().map((product, index) => (
									<tr
										key={product.id}
										className='transition-colors hover:bg-gray-50'
									>
										<td className='py-4 pl-4'>
											<div
												className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
													index === 0
														? 'bg-yellow-100 text-yellow-700'
														: index === 1
															? 'bg-gray-100 text-gray-700'
															: index === 2
																? 'bg-orange-100 text-orange-700'
																: 'bg-gray-50 text-gray-500'
												}`}
											>
												{index + 1}
											</div>
										</td>
										<td className='py-4'>
											<Link
												href={`/products/${product.slug}`}
												className='flex items-center gap-3 transition-colors hover:text-blue-600'
											>
												{product.images[0] && (
													<img
														src={product.images[0]}
														alt={product.name}
														className='h-12 w-12 rounded-lg object-cover'
													/>
												)}
												<div>
													<p className='font-medium text-gray-900'>
														{product.name}
													</p>
													<p className='text-xs text-gray-500'>
														${product.price.toLocaleString()}
													</p>
												</div>
											</Link>
										</td>
										<td className='py-4'>
											<span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'>
												{product.category?.name || 'Без категории'}
											</span>
										</td>
										<td className='py-4 font-medium text-gray-900'>
											${product.price.toLocaleString()}
										</td>
										<td className='py-4 text-center text-sm text-gray-600'>
											{product.totalViews.toLocaleString()}
										</td>
										<td className='py-4 text-center text-sm text-gray-600'>
											{product.totalSold.toLocaleString()}
										</td>
										<td className='py-4 pr-4 text-right text-base font-bold text-gray-900'>
											{getMetricValue(product)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
