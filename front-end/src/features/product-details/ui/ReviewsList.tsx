'use client'

import { type Review, reviewApi } from '@entities/review'
import { useProfile } from '@entities/user'
import { Button, ConfirmDialog } from '@shared/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Shield, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReviewsListProps {
	productId: number
}

export function ReviewsList({ productId }: ReviewsListProps) {
	const [page, setPage] = useState(1)
	const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null)
	const { user } = useProfile()
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['reviews', productId, page],
		queryFn: () => reviewApi.getReviews(productId, page, 10)
	})

	const deleteMutation = useMutation({
		mutationFn: reviewApi.deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['reviews', productId],
				exact: false
			})
			queryClient.invalidateQueries({ queryKey: ['can-review', productId] })
			setDeleteReviewId(null)
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Ошибка при удалении отзыва')
			setDeleteReviewId(null)
		}
	})

	if (isLoading) {
		return <div className='py-8 text-center text-gray-500'>Загрузка...</div>
	}

	if (!data || data.reviews.length === 0) {
		return (
			<div className='py-8 text-center'>
				<p className='text-gray-500'>Пока нет отзывов</p>
				<p className='mt-2 text-sm text-gray-400'>
					Станьте первым, кто оставит отзыв!
				</p>
			</div>
		)
	}

	const handleDeleteClick = (reviewId: number) => {
		setDeleteReviewId(reviewId)
	}

	const handleConfirmDelete = () => {
		if (deleteReviewId) {
			deleteMutation.mutate(deleteReviewId)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
		return date.toLocaleDateString('ru-RU', options)
	}

	return (
		<>
			<div className='space-y-6'>
				{data.reviews.map((review: Review) => (
					<div
						key={review.id}
						className='rounded-lg border border-gray-200 bg-white p-6 transition hover:border-gray-300'
					>
						<div className='flex items-start justify-between'>
							<div className='flex gap-4'>
								<div className='flex-shrink-0'>
									{review.user.picture ? (
										<img
											src={review.user.picture}
											alt={review.user.displayName}
											className='h-12 w-12 rounded-full object-cover'
										/>
									) : (
										<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-bold text-white'>
											{review.user.displayName[0].toUpperCase()}
										</div>
									)}
								</div>

								<div className='flex-1'>
									<div className='mb-2 flex items-center gap-2'>
										<span className='font-semibold text-gray-900'>
											{review.user.displayName}
										</span>
										{review.isVerified && (
											<span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'>
												<Shield className='h-3 w-3' />
												Подтвержденная покупка
											</span>
										)}
										<span className='text-sm text-gray-500'>
											{formatDate(review.createdAt)}
										</span>
									</div>
									<div className='mb-3 flex items-center gap-1'>
										{[1, 2, 3, 4, 5].map((star: number) => (
											<Star
												key={star}
												className={`h-4 w-4 ${
													star <= review.rating
														? 'fill-yellow-400 text-yellow-400'
														: 'fill-gray-200 text-gray-200'
												}`}
											/>
										))}
									</div>
									<p className='text-gray-700'>{review.comment}</p>
								</div>
							</div>
							{user &&
								(user.id === review.user.id || user.role === 'ADMIN') && (
									<div className='flex items-center gap-2'>
										{user.role === 'ADMIN' && user.id !== review.user.id && (
											<span className='rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700'>
												Админ
											</span>
										)}
										<button
											onClick={() => handleDeleteClick(review.id)}
											disabled={deleteMutation.isPending}
											className='rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50'
											title={
												user.role === 'ADMIN' && user.id !== review.user.id
													? 'Удалить (Администратор)'
													: 'Удалить'
											}
										>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								)}
						</div>
					</div>
				))}
				{data.pagination.totalPages > 1 && (
					<div className='flex items-center justify-center gap-2 pt-4'>
						<Button
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
							variant='outline'
						>
							Предыдущая
						</Button>
						<span className='px-4 text-sm text-gray-600'>
							Страница {page} из {data.pagination.totalPages}
						</span>
						<Button
							onClick={() => setPage(p => p + 1)}
							disabled={page === data.pagination.totalPages}
							variant='outline'
						>
							Следующая
						</Button>
					</div>
				)}
			</div>
			<ConfirmDialog
				isOpen={deleteReviewId !== null}
				onClose={() => setDeleteReviewId(null)}
				onConfirm={handleConfirmDelete}
				title='Удалить отзыв?'
				description='Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.'
				confirmText='Удалить'
				cancelText='Отмена'
				variant='danger'
			/>
		</>
	)
}
