'use client'

import { Loader2, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@/shared/hooks/useDebounce'

import { useSearchProducts } from '@/entities/product/hooks/useSearchProducts'

export function SearchBar() {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const debouncedQuery = useDebounce(query, 300)
	const { data: products = [], isLoading } = useSearchProducts(debouncedQuery)

	// Закрыть dropdown при клике вне
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSearch = () => {
		if (query.trim().length >= 2) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`)
			setIsOpen(false)
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		// Enter - перейти на страницу поиска или выбрать товар
		if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedIndex >= 0 && products[selectedIndex]) {
				router.push(`/products/${products[selectedIndex].slug}`)
				setQuery('')
				setIsOpen(false)
			} else {
				handleSearch()
			}
			return
		}

		// Навигация по dropdown
		if (!isOpen || products.length === 0) return

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setSelectedIndex(prev => (prev < products.length - 1 ? prev + 1 : prev))
				break
			case 'ArrowUp':
				e.preventDefault()
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
				break
			case 'Escape':
				setIsOpen(false)
				inputRef.current?.blur()
				break
		}
	}

	const handleClear = () => {
		setQuery('')
		setSelectedIndex(-1)
		inputRef.current?.focus()
	}

	const handleSelectProduct = (slug: string) => {
		router.push(`/products/${slug}`)
		setIsOpen(false)
		setQuery('')
		setSelectedIndex(-1)
	}

	return (
		<div className='relative w-80'>
			<div className='relative flex items-center'>
				<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600' />
				<input
					ref={inputRef}
					type='search'
					value={query}
					onChange={e => {
						setQuery(e.target.value)
						setIsOpen(true)
						setSelectedIndex(-1)
					}}
					onFocus={() => query.length >= 2 && setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder='Поиск товаров...'
					className='focus:border-pur focus:ring-pur/20 w-full rounded-2xl border border-gray-200 bg-white px-3 py-1.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition focus:outline-none focus:ring-2'
				/>

				{isLoading ? (
					<Loader2 className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400' />
				) : query ? (
					<button
						onClick={handleClear}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600'
					>
						<X className='h-4 w-4' />
					</button>
				) : null}
			</div>

			{isOpen && query.length >= 2 && !isLoading && products.length > 0 && (
				<div
					ref={dropdownRef}
					className='absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg'
				>
					<div className='max-h-80 overflow-y-auto'>
						{products.slice(0, 5).map((product, index) => (
							<button
								key={product.id}
								onClick={() => handleSelectProduct(product.slug)}
								className={`flex w-full items-center gap-3 border-b p-3 text-left transition last:border-b-0 ${
									index === selectedIndex ? 'bg-pur/10' : 'hover:bg-gray-50'
								}`}
							>
								{product.images[0] && (
									<img
										src={product.images[0]}
										alt={product.name}
										className='h-12 w-12 rounded object-cover'
									/>
								)}
								<div className='min-w-0 flex-1'>
									<p className='truncate text-sm font-medium text-gray-900'>
										{product.name}
									</p>
									<p className='text-sm text-gray-500'>${product.price}</p>
								</div>
							</button>
						))}
					</div>

					{products.length > 5 && (
						<button
							onClick={handleSearch}
							className='text-pur w-full border-t bg-gray-50 p-3 text-center text-sm font-medium transition hover:bg-gray-100'
						>
							Показать все результаты ({products.length})
						</button>
					)}
				</div>
			)}
		</div>
	)
}
