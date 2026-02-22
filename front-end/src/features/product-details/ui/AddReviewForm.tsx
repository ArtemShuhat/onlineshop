'use client'

import { reviewApi } from '@entities/review'
import { useProfile } from '@entities/user'
import { Button } from '@shared/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface AddReviewFormProps {
	productId: number
}

export function AddReviewForm({ productId }: AddReviewFormProps) {
	const t = useTranslations('addReviewForm')
	const [rating, setRating] = useState(0)
	const [hoveredRating, setHoveredRating] = useState(0)
	const [comment, setComment] = useState('')
	const { user } = useProfile()
	const queryClient = useQueryClient()

	const { data: canReviewData, isLoading: isCheckingPermission } = useQuery({
		queryKey: ['can-review', productId],
		queryFn: () => reviewApi.canReview(productId),
		enabled: !!user
	})

	const mutation = useMutation({
		mutationFn: () => reviewApi.createReview(productId, rating, comment),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['reviews', productId],
				exact: false
			})
			queryClient.invalidateQueries({ queryKey: ['can-review', productId] })
			setRating(0)
			setComment('')
			toast.success(t('success'))
		},
		onError: (error: any) => {
			console.error(t('fullErrorLabel'), error)
			const errorMessage = error?.message || t('submitError')
			toast.error(errorMessage)
		}
	})

	if (!user) {
		return null
	}

	if (isCheckingPermission) {
		return null
	}

	if (canReviewData && !canReviewData.canReview) {
		return null
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (rating === 0) {
			toast.warning(t('chooseRating'))
			return
		}

		if (comment.trim().length < 10) {
			toast.warning(t('minCharsError'))
			return
		}

		mutation.mutate()
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6 rounded-lg border p-6'>
			<h3 className='text-xl font-bold'>{t('title')}</h3>

			<div>
				<label className='mb-2 block text-sm font-semibold text-gray-700'>
					{t('yourRating')}
				</label>
				<div className='flex gap-1'>
					{[1, 2, 3, 4, 5].map((star: number) => (
						<button
							key={star}
							type='button'
							onClick={() => setRating(star)}
							onMouseEnter={() => setHoveredRating(star)}
							onMouseLeave={() => setHoveredRating(0)}
							className='transition hover:scale-110'
						>
							<Star
								className={`h-8 w-8 ${
									star <= (hoveredRating || rating)
										? 'fill-yellow-400 text-yellow-400'
										: 'fill-gray-200 text-gray-200'
								}`}
							/>
						</button>
					))}
				</div>
			</div>
			<div>
				<label className='mb-2 block text-sm font-semibold text-gray-700'>
					{t('yourReview')}
				</label>
				<textarea
					value={comment}
					onChange={e => setComment(e.target.value)}
					rows={4}
					className='w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
					placeholder={t('placeholder')}
					required
				/>
				<p className='mt-1 text-sm text-gray-500'>
					{t('minCharsHint', { count: comment.length })}
				</p>
			</div>

			<Button
				type='submit'
				disabled={
					mutation.isPending || rating === 0 || comment.trim().length < 10
				}
				className='w-full'
			>
				{mutation.isPending ? t('adding') : t('submit')}
			</Button>
		</form>
	)
}
