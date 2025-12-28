'use client'

import { getMainProductImage } from '@shared/lib/getProductImages'
import { Loader2, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useDebounce } from '@/shared/hooks/useDebounce'

import { useSearchProducts } from '@/entities/product/hooks/useSearchProducts'

export function SearchBar() {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const debouncedQuery = useDebounce(query, 300)
	const { data: products = [], isLoading } = useSearchProducts(debouncedQuery)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node

			// Проверяем, был ли клик внутри dropdown или input
			const clickedInsideDropdown = dropdownRef.current?.contains(target)
			const clickedInsideInput = inputRef.current?.contains(target)

			if (!clickedInsideDropdown && !clickedInsideInput) {
				setIsOpen(false)
				if (window.innerWidth <= 480) {
					setIsExpanded(false)
					setQuery('')
				}
			}
		}

		// Используем небольшую задержку для обработки клика
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSearch = () => {
		if (query.trim().length >= 2) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`)
			setIsOpen(false)
			setIsExpanded(false)
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedIndex >= 0 && products[selectedIndex]) {
				router.push(`/products/${products[selectedIndex].slug}`)
				setQuery('')
				setIsOpen(false)
				setIsExpanded(false)
			} else {
				handleSearch()
			}
			return
		}

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
				setIsExpanded(false)
				setQuery('')
				inputRef.current?.blur()
				break
		}
	}

	const handleClear = () => {
		setQuery('')
		setSelectedIndex(-1)
		inputRef.current?.focus()
	}

	const handleSelectProduct = (e: React.MouseEvent, slug: string) => {
		e.preventDefault()
		e.stopPropagation()

		// Закрываем UI
		setIsOpen(false)
		setIsExpanded(false)
		setQuery('')
		setSelectedIndex(-1)

		// Переходим на страницу товара
		router.push(`/products/${slug}`)
	}

	const handleExpandSearch = () => {
		setIsExpanded(true)
		setTimeout(() => inputRef.current?.focus(), 100)
	}

	return (
		<>
			<div className='relative w-80 max-xs:w-auto'>
				{/* Иконка поиска для мобильных (max-xs) */}
				<button
					type='button'
					onClick={handleExpandSearch}
					className='hidden text-black transition-colors hover:text-gray-600 max-xs:block'
					aria-label='Search'
				>
					<Search className='h-5 w-5' />
				</button>

				{/* Поле поиска для десктопа */}
				<div className='relative flex items-center max-xs:hidden'>
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
						className='w-full rounded-2xl border border-gray-200 bg-gray-100 px-3 py-1.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition focus:outline-none'
					/>

					{isLoading ? (
						<Loader2 className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400' />
					) : query ? (
						<button
							type='button'
							onClick={handleClear}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600'
						>
							<X className='h-4 w-4' />
						</button>
					) : null}
				</div>

				{/* Dropdown для десктопа */}
				{isOpen && query.length >= 2 && !isLoading && products.length > 0 && (
					<div
						ref={dropdownRef}
						className='absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-xs:hidden'
					>
						<div className='max-h-80 overflow-y-auto'>
							{products.slice(0, 5).map((product, index) => (
								<button
									type='button'
									key={product.id}
									onClick={e => handleSelectProduct(e, product.slug)}
									className={`flex w-full items-center gap-3 border-b p-3 text-left transition last:border-b-0 ${
										index === selectedIndex ? 'bg-pur/10' : 'hover:bg-gray-50'
									}`}
								>
									{getMainProductImage(product.productImages) && (
										<img
											src={getMainProductImage(product.productImages)!}
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
								type='button'
								onClick={handleSearch}
								className='w-full border-t bg-gray-50 p-3 text-center text-sm font-medium text-pur transition hover:bg-gray-100'
							>
								Показать все результаты ({products.length})
							</button>
						)}
					</div>
				)}
			</div>

			{/* Полноэкранный overlay для мобильных */}
			{isExpanded && (
				<div className='fixed inset-0 z-[100] hidden bg-white max-xs:block'>
					<div className='flex h-16 items-center gap-3 border-b border-gray-200 px-4'>
						<button
							type='button'
							onClick={() => {
								setIsExpanded(false)
								setQuery('')
								setIsOpen(false)
							}}
							className='text-black'
							aria-label='Close search'
						>
							<X className='h-5 w-5' />
						</button>
						<div className='relative flex flex-1 items-center'>
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
								className='w-full rounded-2xl border border-gray-200 bg-gray-100 px-3 py-1.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition focus:outline-none'
							/>

							{isLoading ? (
								<Loader2 className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400' />
							) : query ? (
								<button
									type='button'
									onClick={handleClear}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600'
								>
									<X className='h-4 w-4' />
								</button>
							) : null}
						</div>
					</div>

					{/* Dropdown для мобильных */}
					{isOpen && query.length >= 2 && !isLoading && products.length > 0 && (
						<div
							ref={dropdownRef}
							className='max-h-[calc(100vh-4rem)] overflow-y-auto'
						>
							{products.slice(0, 5).map((product, index) => (
								<button
									type='button'
									key={product.id}
									onClick={e => handleSelectProduct(e, product.slug)}
									className={`flex w-full items-center gap-3 border-b p-3 text-left transition last:border-b-0 ${
										index === selectedIndex ? 'bg-pur/10' : 'hover:bg-gray-50'
									}`}
								>
									{getMainProductImage(product.productImages) && (
										<img
											src={getMainProductImage(product.productImages)!}
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

							{products.length > 5 && (
								<button
									type='button'
									onClick={handleSearch}
									className='w-full border-t bg-gray-50 p-3 text-center text-sm font-medium text-pur transition hover:bg-gray-100'
								>
									Показать все результаты ({products.length})
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</>
	)
}
