'use client'

import type { ProductVariantAttribute } from '@entities/product'
import { Button, Input } from '@shared/ui'
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react'

const EMPTY_ATTRIBUTE: ProductVariantAttribute = {
	key: '',
	name: '',
	value: '',
	valueLabel: '',
	displayType: 'button',
	sortOrder: 0
}

interface VariantAttributesEditorProps {
	variantGroupKey: string
	availableVariantGroupKeys: string[]
	attributes: ProductVariantAttribute[]
	onGroupKeyChange: (value: string) => void
	onChange: (attributes: ProductVariantAttribute[]) => void
}

export function VariantAttributesEditor({
	variantGroupKey,
	availableVariantGroupKeys,
	attributes,
	onGroupKeyChange,
	onChange
}: VariantAttributesEditorProps) {
	const updateAttribute = (
		index: number,
		patch: Partial<ProductVariantAttribute>
	) => {
		onChange(
			attributes.map((attribute, currentIndex) =>
				currentIndex === index
					? {
							...attribute,
							...patch,
							displayType: 'button'
						}
					: attribute
			)
		)
	}

	const removeAttribute = (index: number) => {
		onChange(attributes.filter((_, currentIndex) => currentIndex !== index))
	}

	const addAttribute = () => {
		onChange([...attributes, { ...EMPTY_ATTRIBUTE }])
	}

	return (
		<div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
			<div className='border-b border-gray-200 bg-orange-50 px-6 py-5'>
				<div className='flex items-center gap-2'>
					<SlidersHorizontal className='h-5 w-5 text-orange-600' />
					<h2 className='text-lg font-semibold text-gray-900'>
						Вариативность товара
					</h2>
				</div>
				<p className='mt-1 text-sm text-gray-600'>
					Группа объединяет версии модели, атрибуты показывают их различия.
				</p>
			</div>

			<div className='space-y-5 p-6'>
				<div>
					<label className='mb-2 block text-sm font-medium text-gray-700'>
						Ключ группы вариантов
					</label>
					<Input
						list='variant-group-keys'
						value={variantGroupKey}
						onChange={e => onGroupKeyChange(e.target.value)}
						placeholder='wlmouse-beastx-pro'
					/>
					<datalist id='variant-group-keys'>
						{availableVariantGroupKeys.map(key => (
							<option key={key} value={key} />
						))}
					</datalist>
					<p className='mt-2 text-xs text-gray-500'>
						Начните вводить, чтобы выбрать существующий ключ, или укажите новый.
					</p>
				</div>

				<div className='space-y-4'>
					{attributes.map((attribute, index) => (
						<div
							key={index}
							className='rounded-2xl border border-gray-200 bg-gray-50/60 p-4'
						>
							<div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
								<Input
									value={attribute.key}
									onChange={e =>
										updateAttribute(index, { key: e.target.value })
									}
									placeholder='key: color'
								/>

								<Input
									value={attribute.name}
									onChange={e =>
										updateAttribute(index, { name: e.target.value })
									}
									placeholder='Название оси: Цвет'
								/>

								<Input
									value={attribute.value}
									onChange={e =>
										updateAttribute(index, { value: e.target.value })
									}
									placeholder='value: black'
								/>

								<Input
									value={attribute.valueLabel}
									onChange={e =>
										updateAttribute(index, {
											valueLabel: e.target.value
										})
									}
									placeholder='Подпись: Black'
								/>
							</div>

							<div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
								<div className='w-full max-w-[180px]'>
									<label className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500'>
										Порядок
									</label>
									<Input
										type='number'
										value={attribute.sortOrder ?? 0}
										onChange={e =>
											updateAttribute(index, {
												sortOrder: Number(e.target.value)
											})
										}
										placeholder='0'
									/>
								</div>

								<Button
									type='button'
									variant='outline'
									onClick={() => removeAttribute(index)}
									className='w-full sm:w-auto'
								>
									<Trash2 className='mr-2 h-4 w-4' />
									Удалить
								</Button>
							</div>
						</div>
					))}
				</div>

				<Button type='button' variant='outline' onClick={addAttribute}>
					<Plus className='mr-2 h-4 w-4' />
					Добавить атрибут
				</Button>
			</div>
		</div>
	)
}
