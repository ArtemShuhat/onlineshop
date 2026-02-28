'use client'

import type { ProductVariantAttribute } from '@entities/product'
import { Button, Input } from '@shared/ui'
import { Plus, Trash2 } from 'lucide-react'

const EMPTY_ATTRIBUTE: ProductVariantAttribute = {
	key: '',
	name: '',
	value: '',
	valueLabel: '',
	displayType: 'button',
	colorHex: '#000000',
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
				currentIndex === index ? { ...attribute, ...patch } : attribute
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
		<div className='overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md'>
			<div className='border-b bg-emerald-50 px-6 py-4'>
				<h2 className='text-lg font-semibold text-gray-900'>
					Вариативность товара
				</h2>
				<p className='mt-1 text-sm text-gray-600'>
					Например: одна группа `logitech-g502`, а атрибуты варианта: цвет,
					герцовка, подключение
				</p>
			</div>

			<div className='space-y-4 p-6'>
				<div>
					<label className='mb-2 block text-sm font-medium text-gray-700'>
						Ключ группы вариантов
					</label>
					<Input
						list='variant-group-keys'
						value={variantGroupKey}
						onChange={e => onGroupKeyChange(e.target.value)}
						placeholder='logitech-g502-x'
					/>
					<datalist id='variant-group-keys'>
						{availableVariantGroupKeys.map(key => (
							<option key={key} value={key} />
						))}
					</datalist>
					<p className='mt-2 text-xs text-gray-500'>
						Начните вводить, чтобы выбрать существующий ключ, или введите
						новый
					</p>
				</div>

				<div className='space-y-4'>
					{attributes.map((attribute, index) => (
						<div
							key={index}
							className='grid gap-3 rounded-xl border p-4 md:grid-cols-2 xl:grid-cols-3'
						>
							<Input
								value={attribute.key}
								onChange={e => updateAttribute(index, { key: e.target.value })}
								placeholder='key: color'
							/>

							<Input
								value={attribute.name}
								onChange={e => updateAttribute(index, { name: e.target.value })}
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
								placeholder='Подпись: Черный'
							/>

							<select
								value={attribute.displayType ?? 'button'}
								onChange={e =>
									updateAttribute(index, {
										displayType: e.target.value as 'button' | 'color'
									})
								}
								className='h-10 rounded-md border border-gray-300 px-3'
							>
								<option value='button'>Кнопка</option>
								<option value='color'>Цвет</option>
							</select>

							<Input
								type='number'
								value={attribute.sortOrder ?? 0}
								onChange={e =>
									updateAttribute(index, {
										sortOrder: Number(e.target.value)
									})
								}
								placeholder='Порядок'
							/>

							{attribute.displayType === 'color' && (
								<input
									type='color'
									value={attribute.colorHex ?? '#000000'}
									onChange={e =>
										updateAttribute(index, {
											colorHex: e.target.value
										})
									}
									className='h-10 w-full rounded-md border border-gray-300'
								/>
							)}

							<div className='flex items-center'>
								<Button
									type='button'
									variant='outline'
									onClick={() => removeAttribute(index)}
									className='w-full'
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
