'use client'

import type { Product, ProductSiblingVariant } from '@entities/product'
import { getMainProductImage } from '@shared/lib'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface ProductVariantPickerProps {
	product: Product
}

export function ProductVariantPicker({ product }: ProductVariantPickerProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const axes = product.variantAxes ?? []
	const siblings = product.siblingVariants ?? []
	const currentAttributes = product.variantAttributes ?? []

	if (axes.length === 0 || siblings.length === 0) {
		return null
	}

	const selectedMap = Object.fromEntries(
		currentAttributes.map(attr => [attr.key, attr.value])
	)

	const currentLabelMap = Object.fromEntries(
		currentAttributes.map(attr => [attr.key, attr.valueLabel])
	)

	const colorAxis = axes.find(axis => axis.displayType === 'color')
	const colorAxisKey = colorAxis?.key
	const currentColorValue = colorAxisKey ? selectedMap[colorAxisKey] : undefined

	const hasAttributeValue = (
		variant: ProductSiblingVariant,
		axisKey: string,
		value: string
	) =>
		variant.variantAttributes.some(
			attr => attr.key === axisKey && attr.value === value
		)

	const findExactVariant = (
		variants: ProductSiblingVariant[],
		selection: Record<string, string>
	) =>
		variants.find(variant => {
			const variantMap = Object.fromEntries(
				variant.variantAttributes.map(attr => [attr.key, attr.value])
			)

			return Object.entries(selection).every(
				([key, value]) => variantMap[key] === value
			)
		})

	const findVariantForAxis = (axisKey: string, candidateValue: string) => {
		if (axisKey === colorAxisKey) {
			return siblings.find(variant =>
				hasAttributeValue(variant, axisKey, candidateValue)
			)
		}

		const sameColorSiblings =
			colorAxisKey && currentColorValue
				? siblings.filter(variant =>
						hasAttributeValue(variant, colorAxisKey, currentColorValue)
					)
				: siblings

		const exactSelection = {
			...selectedMap,
			[axisKey]: candidateValue
		}

		const exactSameColorVariant = findExactVariant(
			sameColorSiblings,
			exactSelection
		)

		if (exactSameColorVariant) {
			return exactSameColorVariant
		}

		return sameColorSiblings.find(variant =>
			hasAttributeValue(variant, axisKey, candidateValue)
		)
	}

	const getAxisHeading = (axisKey: string, axisName: string) => {
		const selectedLabel = currentLabelMap[axisKey]
		return selectedLabel ? `${axisName}: ${selectedLabel}` : axisName
	}

	const renderColorOption = (
		axisKey: string,
		option: (typeof axes)[number]['values'][number]
	) => {
		const matchedVariant = findVariantForAxis(axisKey, option.value)
		const isSelected = selectedMap[axisKey] === option.value
		const isUnavailable = !matchedVariant
		const isCurrent = matchedVariant?.slug === product.slug
		const imageUrl = matchedVariant
			? getMainProductImage(matchedVariant.productImages)
			: null

		return (
			<button
				key={`${axisKey}-${option.value}`}
				type='button'
				disabled={isUnavailable || isPending}
				onClick={() => {
					if (!matchedVariant || isCurrent) return

					startTransition(() => {
						router.push(`/products/${matchedVariant.slug}`)
					})
				}}
				className={`group relative flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white transition ${
					isSelected
						? 'border-gray-900 shadow-[0_0_0_1px_rgba(17,24,39,1)]'
						: 'border-gray-200 hover:border-gray-400'
				} ${isUnavailable ? 'cursor-not-allowed opacity-35' : ''}`}
				title={option.label}
				aria-label={option.label}
			>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={option.label}
						fill
						sizes='76px'
						className='object-contain p-1.5'
					/>
				) : (
					<span
						className='h-10 w-10 rounded-full border border-black/10'
						style={{
							backgroundColor: option.colorHex || '#e5e7eb'
						}}
					/>
				)}

				<span
					className='absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border border-white shadow-sm'
					style={{
						backgroundColor: option.colorHex || '#d1d5db'
					}}
				/>
			</button>
		)
	}

	const renderButtonOption = (
		axisKey: string,
		option: (typeof axes)[number]['values'][number]
	) => {
		const matchedVariant = findVariantForAxis(axisKey, option.value)
		const isSelected = selectedMap[axisKey] === option.value
		const isUnavailable = !matchedVariant
		const isCurrent = matchedVariant?.slug === product.slug

		return (
			<button
				key={`${axisKey}-${option.value}`}
				type='button'
				disabled={isUnavailable || isPending}
				onClick={() => {
					if (!matchedVariant || isCurrent) return

					startTransition(() => {
						router.push(`/products/${matchedVariant.slug}`)
					})
				}}
				className={`relative min-w-[136px] rounded-xl border px-5 py-4 text-left text-sm font-medium transition ${
					isSelected
						? 'border-gray-900 bg-white text-gray-900 shadow-[0_0_0_1px_rgba(17,24,39,1)]'
						: 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
				} ${isUnavailable ? 'cursor-not-allowed border-red-200 text-red-300' : ''}`}
			>
				<span className={isUnavailable ? 'line-through' : ''}>
					{option.label}
				</span>
			</button>
		)
	}

	return (
		<div className='space-y-6 border-t border-gray-200 pt-6'>
			{axes.map(axis => (
				<div key={axis.key} className='space-y-3'>
					<p className='text-[15px] font-medium text-gray-900'>
						{getAxisHeading(axis.key, axis.name)}
					</p>

					<div
						className={
							axis.displayType === 'color'
								? 'flex gap-3 overflow-x-auto pb-1'
								: 'flex flex-wrap gap-3'
						}
					>
						{axis.values.map(option =>
							axis.displayType === 'color'
								? renderColorOption(axis.key, option)
								: renderButtonOption(axis.key, option)
						)}
					</div>
				</div>
			))}
		</div>
	)
}
