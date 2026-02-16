'use client'

import { type Banner, getBanners } from '@entities/banner'
import { HeroSection } from '@widgets/hero-section'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function BannerCarousel() {
	const [banners, setBanners] = useState<Banner[]>([])
	const [loading, setLoading] = useState(true)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)

	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
		initial: 0,
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel)
		},
		created() {
			setLoaded(true)
		},
		loop: true
	})

	useEffect(() => {
		loadBanners()
	}, [])

	const loadBanners = async () => {
		try {
			const data = await getBanners()
			setBanners(data)
		} catch (error) {
			console.error('Ошибка загрузки баннеров:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<>
				<div className='mx-auto h-[650px] max-w-[1920px] animate-pulse bg-gray-200' />
				<div className='mx-auto h-[14px] max-w-[40px] animate-pulse bg-gray-200 rounded-2xl mt-3' />
			</>
		)
	}

	return banners.length === 0 ? (
		<HeroSection />
	) : (
		<section className='mx-auto max-w-[1920px] max-sm:px-3 max-sm:py-4'>
			<div className='navigation-wrapper relative'>
				<div ref={sliderRef} className='keen-slider overflow-hidden'>
					{banners.map(banner => (
						<div key={banner.id} className='keen-slider__slide'>
							<div className='relative h-[650px] w-full max-sm:h-[400px] max-md:h-[300px]'>
								<Image
									src={banner.url}
									alt={`Banner ${banner.id}`}
									fill
									className='object-cover'
									priority
								/>
							</div>
						</div>
					))}
				</div>

				{loaded && instanceRef.current && banners.length > 1 && (
					<>
						<Arrow
							left
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation()
								instanceRef.current?.prev()
							}}
							disabled={false}
						/>
						<Arrow
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation()
								instanceRef.current?.next()
							}}
							disabled={false}
						/>
					</>
				)}
			</div>

			{loaded && instanceRef.current && banners.length > 1 && (
				<div className='mt-4 flex justify-center gap-2'>
					{banners.map((_, idx) => (
						<button
							key={idx}
							onClick={() => instanceRef.current?.moveToIdx(idx)}
							className={`h-2.5 w-2.5 rounded-full transition-colors ${
								currentSlide === idx
									? 'bg-purple-600'
									: 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
							}`}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>
			)}
		</section>
	)
}

interface ArrowProps {
	disabled: boolean
	left?: boolean
	onClick: (e: React.MouseEvent) => void
}

function Arrow({ disabled, left, onClick }: ArrowProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md transition-all hover:bg-white disabled:opacity-30 dark:bg-gray-800/80 dark:hover:bg-gray-800 ${
				left ? 'left-2' : 'right-2'
			}`}
			aria-label={left ? 'Previous slide' : 'Next slide'}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={`h-5 w-5 ${left ? 'rotate-180' : ''}`}
			>
				<polyline points='9 18 15 12 9 6' />
			</svg>
		</button>
	)
}
