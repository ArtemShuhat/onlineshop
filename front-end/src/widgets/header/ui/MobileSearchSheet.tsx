'use client'

import { getTopProducts } from '@entities/analytics'
import { getProducts, searchProducts } from '@entities/product'
import { useDebounce } from '@shared/hooks'
import { Skeleton } from '@shared/ui'
import { useQuery } from '@tanstack/react-query'
import { useMobileSheetDrag } from '@widgets/header'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type SearchSuggestion = {
	id: number
	name: string
	slug: string
}

interface MobileSearchSheetProps {
	isOpen: boolean
	onClose: () => void
}

export function MobileSearchSheet({ isOpen, onClose }: MobileSearchSheetProps) {
	const t = useTranslations('header')
	const tSearch = useTranslations('searchBar')
	const router = useRouter()
	const inputRef = useRef<HTMLInputElement | null>(null)

	const [query, setQuery] = useState('')
	const [recommendations, setRecommendations] = useState<SearchSuggestion[]>([])
	const [isLoadingRecommendations, setIsLoadingRecommendations] =
		useState(false)

	const debouncedQuery = useDebounce(query.trim(), 300)
	const queryTrimmed = query.trim()

	const { sheetRef, dragHandlers } = useMobileSheetDrag({ isOpen, onClose })

	const { data: searchData, isLoading: isLoadingSearch } = useQuery({
		queryKey: ['mobile-header-search', debouncedQuery],
		queryFn: () => searchProducts({ q: debouncedQuery, limit: 8 }),
		enabled: isOpen && debouncedQuery.length >= 2
	})

	useEffect(() => {
		if (!isOpen) {
			setQuery('')
			return
		}

		let active = true

		const loadRecommendations = async () => {
			setIsLoadingRecommendations(true)
			try {
				let suggestions: SearchSuggestion[] = []

				try {
					const top = await getTopProducts('views', 8)
					suggestions = top.map(p => ({ id: p.id, name: p.name, slug: p.slug }))
				} catch {
					suggestions = []
				}

				if (!suggestions.length) {
					try {
						const all = await getProducts()
						suggestions = all
							.filter(p => p.isVisible)
							.sort((a, b) => a.name.localeCompare(b.name))
							.slice(0, 12)
							.map(p => ({ id: p.id, name: p.name, slug: p.slug }))
					} catch {
						suggestions = []
					}
				}

				if (active) setRecommendations(suggestions)
			} finally {
				if (active) setIsLoadingRecommendations(false)
			}
		}

		void loadRecommendations()
		return () => {
			active = false
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return
		if (window.matchMedia('(max-width: 480px)').matches) return

		const focusInput = () => {
			inputRef.current?.focus({ preventScroll: true })
		}

		focusInput()
		const rafId = requestAnimationFrame(focusInput)
		const timeoutId = window.setTimeout(focusInput, 220)

		return () => {
			cancelAnimationFrame(rafId)
			window.clearTimeout(timeoutId)
		}
	}, [isOpen])

	const suggestions =
		debouncedQuery.length >= 2
			? (searchData?.hits ?? []).map(h => ({
					id: h.id,
					name: h.name,
					slug: h.slug
				}))
			: recommendations

	const isLoadingSuggestions =
		debouncedQuery.length >= 2 ? isLoadingSearch : isLoadingRecommendations

	const handleSubmit = () => {
		if (queryTrimmed.length < 2) return
		router.push(`/search?q=${encodeURIComponent(queryTrimmed)}`)
		onClose()
	}

	return (
		<div
			className={`fixed inset-0 z-[60] hidden max-sm:block ${
				isOpen ? '' : 'pointer-events-none'
			}`}
		>
			<button
				type='button'
				onClick={onClose}
				aria-label={t('mobile.closeSearchBackdrop')}
				className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0'
				}`}
			/>

			<aside
				ref={sheetRef}
				className={`absolute inset-y-0 right-0 w-[86%] max-w-[420px] rounded-l-[28px] bg-white transition-transform duration-300 ease-out max-xs:inset-x-0 max-xs:bottom-0 max-xs:top-auto max-xs:h-[86dvh] max-xs:w-full max-xs:max-w-none max-xs:rounded-l-none max-xs:rounded-t-[28px] ${
					isOpen
						? 'translate-x-0 max-xs:translate-x-0 max-xs:translate-y-0'
						: 'translate-x-full max-xs:translate-x-0 max-xs:translate-y-full'
				}`}
			>
				<div className='flex h-full flex-col'>
					<div
						className='hidden touch-none items-center justify-center px-4 pb-2 pt-2 max-xs:flex'
						{...dragHandlers}
					>
						<div className='h-1.5 w-12 rounded-full bg-zinc-300' />
					</div>

					<div className='flex items-center justify-between border-b border-zinc-200 px-4 py-5'>
						<h2 className='text-2xl font-bold leading-none text-zinc-900 max-xs:text-3xl'>
							{t('mobile.searchTitle')}
						</h2>
						<button
							type='button'
							onClick={onClose}
							className='rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-100 max-xs:hidden'
							aria-label={t('mobile.closeSearch')}
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto p-4'>
						<div className='mb-4'>
							<input
								ref={inputRef}
								type='search'
								value={query}
								onChange={e => setQuery(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleSubmit()
									}
								}}
								placeholder={tSearch('inputPlaceHolder')}
								className='w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 focus:outline-none'
							/>
						</div>

						{queryTrimmed.length >= 2 && (
							<button
								type='button'
								onClick={handleSubmit}
								className='mb-4 w-full rounded-lg bg-zinc-100 px-4 py-3 text-left text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200'
							>
								{t('mobile.searchFor', { query: queryTrimmed })}
							</button>
						)}

						<div className='space-y-1'>
							{isLoadingSuggestions ? (
								<div className='space-y-2'>
									<Skeleton className='h-8 w-full rounded-md' />
									<Skeleton className='h-8 w-full rounded-md' />
									<Skeleton className='h-8 w-full rounded-md' />
								</div>
							) : suggestions.length > 0 ? (
								suggestions.map(product => (
									<Link
										key={product.id}
										href={`/products/${product.slug}`}
										onClick={onClose}
										className='text-md block rounded-md px-2 py-2 text-zinc-900 transition-colors hover:bg-zinc-100 max-xs:text-base'
									>
										{product.name}
									</Link>
								))
							) : (
								<p className='px-2 py-2 text-sm text-zinc-500'>
									{t('mobile.noProductsFound')}
								</p>
							)}
						</div>
					</div>
				</div>
			</aside>
		</div>
	)
}
