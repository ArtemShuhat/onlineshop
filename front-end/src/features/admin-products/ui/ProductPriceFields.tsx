'use client'

import { Button, Input, Label } from '@shared/ui'
import { ArrowRight, Calculator } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { convertCurrency } from '../api/currencyApi'

type Currency = 'USD' | 'EUR' | 'UAH'

interface ProductPriceFieldsProps {
	priceUSD: number
	priceEUR: number
	priceUAH: number
	onPriceChange: (currency: Currency, value: number) => void
}

export function ProductPriceFields({
	priceUSD,
	priceEUR,
	priceUAH,
	onPriceChange
}: ProductPriceFieldsProps) {
	const t = useTranslations('adminProductPriceToasts')
	const [convertAmount, setConvertAmount] = useState('100')
	const [convertFrom, setConvertFrom] = useState<Currency>('USD')
	const [convertTo, setConvertTo] = useState<Currency>('EUR')
	const [convertResult, setConvertResult] = useState<string | null>(null)
	const [isConverting, setIsConverting] = useState(false)

	// Храним сырые значения для каждого поля (чтобы курсор не прыгал)
	const [rawValues, setRawValues] = useState({
		USD: priceUSD > 0 ? String(priceUSD) : '',
		EUR: priceEUR > 0 ? String(priceEUR) : '',
		UAH: priceUAH > 0 ? String(priceUAH) : ''
	})

	// Отслеживаем, какое поле в фокусе
	const [focusedField, setFocusedField] = useState<Currency | null>(null)

	const handleConvert = async () => {
		const amount = Number(convertAmount)
		if (!amount || amount <= 0) {
			toast.error(t('enterValidAmount'))
			return
		}

		if (convertFrom === convertTo) {
			setConvertResult(`${amount} ${convertTo}`)
			return
		}

		setIsConverting(true)
		setConvertResult(null)

		try {
			const data = await convertCurrency({
				from: convertFrom,
				to: convertTo,
				amount
			})

			setConvertResult(`${data.result.toFixed(2)} ${data.to}`)
		} catch (error: any) {
			toast.error(error.message || t('conversionError'))
			setConvertResult(null)
		} finally {
			setIsConverting(false)
		}
	}

	const handleApplyConvertedPrice = () => {
		if (!convertResult) return

		const resultValue = parseFloat(convertResult.split(' ')[0])
		if (isNaN(resultValue)) return

		onPriceChange(convertTo, resultValue)
		setRawValues(prev => ({
			...prev,
			[convertTo]: String(resultValue)
		}))
		toast.success(t('priceUpdated', { currency: convertTo }))
	}

	const handlePriceInput = (
		currency: Currency,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value

		// Разрешаем пустую строку, числа с точкой/запятой
		if (value === '' || /^[\d.,]*$/.test(value)) {
			// Заменяем запятую на точку
			const normalizedValue = value.replace(',', '.')
			setRawValues(prev => ({
				...prev,
				[currency]: normalizedValue
			}))

			// Обновляем родительский компонент числовым значением
			const numValue = parseFloat(normalizedValue) || 0
			onPriceChange(currency, numValue)
		}
	}

	const handlePriceBlur = (currency: Currency) => {
		setFocusedField(null)
		// При потере фокуса форматируем значение
		const numValue = parseFloat(rawValues[currency]) || 0
		if (numValue > 0) {
			setRawValues(prev => ({
				...prev,
				[currency]: numValue.toFixed(2)
			}))
		} else {
			setRawValues(prev => ({
				...prev,
				[currency]: ''
			}))
		}
	}

	const handlePriceFocus = (currency: Currency) => {
		setFocusedField(currency)
	}

	// Получаем отображаемое значение: если поле в фокусе - показываем сырое, иначе форматированное
	const getDisplayValue = (
		currency: Currency,
		currentValue: number
	): string => {
		if (focusedField === currency) {
			return rawValues[currency]
		}
		return currentValue > 0
			? currentValue.toFixed(2)
			: rawValues[currency] || ''
	}

	return (
		<div className='space-y-6'>
			<div>
				<Label className='mb-4 block text-base font-semibold'>
					Цены в разных валютах <span className='text-red-500'>*</span>
				</Label>
				<div className='grid gap-4 md:grid-cols-3'>
					<div className='relative'>
						<Input
							type='text'
							inputMode='decimal'
							value={getDisplayValue('USD', priceUSD)}
							onChange={e => handlePriceInput('USD', e)}
							onFocus={() => handlePriceFocus('USD')}
							onBlur={() => handlePriceBlur('USD')}
							placeholder='0.00'
							className='peer pb-5 pt-8'
						/>
						<label className='absolute left-3 top-2 text-xs text-gray-500 peer-focus:text-blue-600'>
							USD ($) <span className='text-red-500'>*</span>
						</label>
					</div>

					<div className='relative'>
						<Input
							type='text'
							inputMode='decimal'
							value={getDisplayValue('EUR', priceEUR)}
							onChange={e => handlePriceInput('EUR', e)}
							onFocus={() => handlePriceFocus('EUR')}
							onBlur={() => handlePriceBlur('EUR')}
							placeholder='0.00'
							className='peer pb-5 pt-8'
						/>
						<label className='absolute left-3 top-2 text-xs text-gray-500 peer-focus:text-blue-600'>
							EUR (€) <span className='text-red-500'>*</span>
						</label>
					</div>

					<div className='relative'>
						<Input
							type='text'
							inputMode='decimal'
							value={getDisplayValue('UAH', priceUAH)}
							onChange={e => handlePriceInput('UAH', e)}
							onFocus={() => handlePriceFocus('UAH')}
							onBlur={() => handlePriceBlur('UAH')}
							placeholder='0.00'
							className='peer pb-5 pt-8'
						/>
						<label className='absolute left-3 top-2 text-xs text-gray-500 peer-focus:text-blue-600'>
							UAH (₴) <span className='text-red-500'>*</span>
						</label>
					</div>
				</div>
			</div>
			<div className='rounded-lg border border-blue-200 bg-blue-50/50 p-4'>
				<div className='mb-3 flex items-center gap-2'>
					<Calculator className='h-4 w-4 text-blue-600' />
					<Label className='text-sm font-semibold text-gray-700'>
						Конвертер валют
					</Label>
				</div>

				<div className='grid items-end gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]'>
					<div>
						<Label className='text-xs text-gray-600'>Сумма</Label>
						<Input
							type='text'
							inputMode='decimal'
							value={convertAmount}
							onChange={e => {
								const value = e.target.value
								if (value === '' || /^[\d.,]*$/.test(value)) {
									setConvertAmount(value.replace(',', '.'))
								}
							}}
							placeholder='100'
							className='mt-1'
						/>
					</div>

					<div>
						<Label className='text-xs text-gray-600'>Из</Label>
						<select
							value={convertFrom}
							onChange={e => setConvertFrom(e.target.value as Currency)}
							className='mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<option value='USD'>USD</option>
							<option value='EUR'>EUR</option>
							<option value='UAH'>UAH</option>
						</select>
					</div>

					<div className='flex items-center justify-center pb-2'>
						<ArrowRight className='h-4 w-4 text-gray-400' />
					</div>

					<div>
						<Label className='text-xs text-gray-600'>В</Label>
						<select
							value={convertTo}
							onChange={e => setConvertTo(e.target.value as Currency)}
							className='mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<option value='USD'>USD</option>
							<option value='EUR'>EUR</option>
							<option value='UAH'>UAH</option>
						</select>
					</div>

					<div>
						<Button
							type='button'
							onClick={handleConvert}
							disabled={isConverting}
							variant='outline'
							size='default'
						>
							{isConverting ? (
								<>
									<div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
									Считаю...
								</>
							) : (
								'Конвертировать'
							)}
						</Button>
					</div>
				</div>

				{convertResult && (
					<div className='mt-3 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm'>
						<div>
							<p className='text-xs text-gray-500'>Результат:</p>
							<p className='text-lg font-semibold text-gray-900'>
								{convertResult}
							</p>
						</div>
						<Button
							type='button'
							onClick={handleApplyConvertedPrice}
							size='sm'
							variant='default'
						>
							Применить к цене
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
