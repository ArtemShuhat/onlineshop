'use client'

import { type ProductSortBy } from '@entities/product'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ProductSortProps {
	value: ProductSortBy | undefined
	onChange: (value: ProductSortBy | undefined) => void
}

const sortOptions = [
	{ value: undefined, label: 'Рекомендовано' },
	{ value: 'newest' as ProductSortBy, label: 'Сначала новые' },
	{ value: 'oldest' as ProductSortBy, label: 'Сначала старые' },
	{ value: 'price_high' as ProductSortBy, label: 'Сначала дорогие' },
	{ value: 'price_low' as ProductSortBy, label: 'Сначала дешёвые' }
]

export function ProductSort({ value, onChange }: ProductSortProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const selectedOption = sortOptions.find(opt => opt.value === value)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSelect = (optionValue: ProductSortBy | undefined) => {
		onChange(optionValue)
		setIsOpen(false)
	}

	return (
		<div className='relative' ref={dropdownRef}>
			<div className='flex items-center gap-3'>
				<button
					type='button'
					onClick={() => setIsOpen(!isOpen)}
					className='flex min-w-[200px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50'
				>
					<span>{selectedOption?.label || 'По умолчанию'}</span>
					<ChevronDown
						className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					/>
				</button>
			</div>

			{isOpen && (
				<div className='absolute right-0 top-full z-50 mt-2 w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'>
					{sortOptions.map(option => (
						<button
							key={option.value || 'default'}
							type='button'
							onClick={() => handleSelect(option.value)}
							className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-pur hover:text-white ${
								option.value === value
									? 'font-medium text-purh'
									: 'text-gray-900'
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
