'use client'

import { PriceTag } from '@entities/currency'
import { Product } from '@entities/product'
import { AddReviewForm, ReviewsList } from '@features/product-details'
import { BookOpen, Check, ClipboardList, Shield, Star } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

interface ProductTabsProps {
	product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
	const t = useTranslations('productTabs')
	const [activeTab, setActiveTab] = useState('description')

	const locale = useLocale()

	const localizedDescription =
		locale === 'en'
			? product.descriptionEn
			: locale === 'uk'
				? product.descriptionUk
				: product.descriptionRu

	const tabs = [
		{
			id: 'description',
			label: t('tabs.description'),
			icon: BookOpen,
			content: (
				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 shadow-sm'>
							<BookOpen className='h-5 w-5 text-blue-700' />
						</div>
						<h3 className='text-2xl font-bold text-gray-900'>
							{t('description.title')}
						</h3>
					</div>

					<div className='prose prose-lg max-w-none'>
						<p className='leading-relaxed text-gray-700'>
							{localizedDescription}
						</p>
					</div>
					<div className='mt-6 grid gap-3 sm:grid-cols-2'>
						<div className='flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4'>
							<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
								<Check className='h-5 w-5 text-green-600' />
							</div>
							<div>
								<p className='font-bold text-green-900'>
									{t('description.originalProduct')}
								</p>
								<p className='text-sm text-green-700'>
									{t('description.authenticityGuarantee')}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4'>
							<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
								<Shield className='h-5 w-5 text-blue-600' />
							</div>
							<div>
								<p className='font-bold text-blue-900'>
									{t('description.officialWarranty')}
								</p>
								<p className='text-sm text-blue-700'>
									{t('description.fromManufacturer')}
								</p>
							</div>
						</div>
					</div>
				</div>
			)
		},
		{
			id: 'specification',
			label: t('tabs.specification'),
			icon: ClipboardList,
			content: (
				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 shadow-sm'>
							<ClipboardList className='h-5 w-5 text-green-700' />
						</div>
						<h3 className='text-2xl font-bold text-gray-900'>
							{t('specification.title')}
						</h3>
					</div>

					<div className='space-y-2'>
						<div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4'>
							<span className='font-medium text-gray-600'>
								{t('specification.name')}:
							</span>
							<span className='font-bold text-gray-900'>{product.name}</span>
						</div>
						<div className='grid grid-cols-2 gap-4 rounded-lg p-4'>
							<span className='font-medium text-gray-600'>
								{t('specification.price')}:
							</span>
							<PriceTag
								priceUSD={product.priceUSD}
								priceEUR={product.priceEUR}
								priceUAH={product.priceUAH}
								className='font-bold text-gray-900'
							/>
						</div>
						<div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4'>
							<span className='font-medium text-gray-600'>
								{t('specification.category')}:
							</span>
							<span className='font-bold text-gray-900'>
								{locale === 'en'
									? (product.category?.nameEn ?? '-')
									: locale === 'uk'
										? (product.category?.nameUk ?? '-')
										: (product.category?.nameRu ?? '-')}
							</span>
						</div>
						<div className='grid grid-cols-2 gap-4 rounded-lg p-4'>
							<span className='font-medium text-gray-600'>
								{t('specification.availability')}:
							</span>
							<span className='font-bold text-green-600'>
								{t('specification.pieces', { count: product.quantity })}
							</span>
						</div>
						<div className='grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4'>
							<span className='font-medium text-gray-600'>
								{t('specification.sku')}:
							</span>
							<span className='font-mono text-sm font-bold text-gray-900'>
								#{product.id.toString().padStart(6, '0')}
							</span>
						</div>
					</div>
				</div>
			)
		},
		{
			id: 'reviews',
			label: t('tabs.reviews'),
			icon: Star,
			content: (
				<div className='space-y-6'>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 shadow-sm'>
							<Star className='h-5 w-5 fill-orange-500 text-orange-500' />
						</div>
						<h3 className='text-2xl font-bold text-gray-900' id='reviews'>
							{t('reviews.title')}
						</h3>
					</div>
					<AddReviewForm productId={product.id} />
					<ReviewsList productId={product.id} />
				</div>
			)
		}
	]

	return (
		<div className='mt-12'>
			<div className='overflow-hidden rounded-t-2xl border bg-white shadow-sm'>
				<div className='flex'>
					{tabs.map(tab => {
						const Icon = tab.icon
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`relative flex-1 px-6 py-4 font-bold transition ${
									activeTab === tab.id
										? 'bg-gradient-to-br from-purple-50 to-pink-50 text-pur'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								}`}
							>
								<span className='flex items-center justify-center gap-2'>
									<Icon className='h-5 w-5' />
									{tab.label}
								</span>
								{activeTab === tab.id && (
									<span className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pur to-pink-800' />
								)}
							</button>
						)
					})}
				</div>
			</div>
			<div className='rounded-b-2xl border border-t-0 bg-white p-8 shadow-sm'>
				{tabs.find(tab => tab.id === activeTab)?.content}
			</div>
		</div>
	)
}
