'use client'

import { translateText } from '@shared/api'
import { Textarea } from '@shared/ui'
import { Globe, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface DescriptionValues {
	descriptionRu: string
	descriptionEn: string
	descriptionUk: string
}

interface ProductDescriptionFieldsProps {
	values: DescriptionValues
	onChange: (field: keyof DescriptionValues, value: string) => void
}

export function ProductDescriptionFields({
	values,
	onChange
}: ProductDescriptionFieldsProps) {
	const [isTranslating, setIsTranslating] = useState<{
		EN: boolean
		UK: boolean
	}>({ EN: false, UK: false })

	const handleTranslate = async (lang: 'EN' | 'UK') => {
		if (!values.descriptionRu) {
			toast.error('Сначала введите описание на русском')
			return
		}

		try {
			setIsTranslating(prev => ({ ...prev, [lang]: true }))
			const translated = await translateText(values.descriptionRu, lang)
			onChange(lang === 'EN' ? 'descriptionEn' : 'descriptionUk', translated)
			toast.success(
				`Переведено на ${lang === 'EN' ? 'английский' : 'украинский'}`
			)
		} catch (error: any) {
			toast.error('Ошибка перевода: ' + (error.message || 'Попробуйте снова'))
		} finally {
			setIsTranslating(prev => ({ ...prev, [lang]: false }))
		}
	}

	return (
		<div className='overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md'>
			<div className='border-b bg-indigo-50 px-6 py-4'>
				<h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
					<Globe className='h-5 w-5 text-indigo-600' />
					Описание товара
				</h2>
				<p className='mt-0.5 text-sm text-gray-500'>
					Напишите описание на русском, затем переведите на остальные языки
				</p>
			</div>
			<div className='space-y-5 p-6'>
				<div>
					<div className='mb-1.5 flex items-center gap-2'>
						<LangBadge lang='RU' color='blue' />
						<label className='text-sm font-medium text-gray-700'>
							Описание (русский) <span className='text-red-500'>*</span>
						</label>
					</div>
					<Textarea
						value={values.descriptionRu}
						onChange={e => onChange('descriptionRu', e.target.value)}
						placeholder='Введите описание товара на русском языке...'
						rows={5}
					/>
					<CharCount count={values.descriptionRu.length} />
				</div>
				<div>
					<FieldHeader
						lang='EN'
						color='green'
						label='Description (English)'
						isTranslating={isTranslating.EN}
						disabled={!values.descriptionRu}
						onTranslate={() => handleTranslate('EN')}
						translateLabel='Перевести с RU'
					/>
					<Textarea
						value={values.descriptionEn}
						onChange={e => onChange('descriptionEn', e.target.value)}
						placeholder='Enter product description in English...'
						rows={4}
					/>
					<CharCount count={values.descriptionEn.length} />
				</div>
				<div>
					<FieldHeader
						lang='UK'
						color='yellow'
						label='Опис (українська)'
						isTranslating={isTranslating.UK}
						disabled={!values.descriptionRu}
						onTranslate={() => handleTranslate('UK')}
						translateLabel='Перекласти з RU'
					/>
					<Textarea
						value={values.descriptionUk}
						onChange={e => onChange('descriptionUk', e.target.value)}
						placeholder='Введіть опис товару українською мовою...'
						rows={4}
					/>
					<CharCount count={values.descriptionUk.length} />
				</div>
			</div>
		</div>
	)
}

function LangBadge({
	lang,
	color
}: {
	lang: string
	color: 'blue' | 'green' | 'yellow'
}) {
	const colors = {
		blue: 'bg-blue-100 text-blue-700',
		green: 'bg-green-100 text-green-700',
		yellow: 'bg-yellow-100 text-yellow-700'
	}
	return (
		<span
			className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${colors[color]}`}
		>
			{lang}
		</span>
	)
}

function FieldHeader({
	lang,
	color,
	label,
	isTranslating,
	disabled,
	onTranslate,
	translateLabel
}: {
	lang: string
	color: 'blue' | 'green' | 'yellow'
	label: string
	isTranslating: boolean
	disabled: boolean
	onTranslate: () => void
	translateLabel: string
}) {
	return (
		<div className='mb-1.5 flex items-center justify-between'>
			<div className='flex items-center gap-2'>
				<LangBadge lang={lang} color={color} />
				<label className='text-sm font-medium text-gray-700'>
					{label} <span className='text-red-500'>*</span>
				</label>
			</div>
			<button
				type='button'
				onClick={onTranslate}
				disabled={disabled || isTranslating}
				className='flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50'
			>
				{isTranslating ? (
					<Loader2 className='h-3.5 w-3.5 animate-spin' />
				) : (
					<Globe className='h-3.5 w-3.5' />
				)}
				{translateLabel}
			</button>
		</div>
	)
}

function CharCount({ count }: { count: number }) {
	return (
		<div className='mt-1 text-right text-xs text-gray-400'>
			{count} символов
		</div>
	)
}
