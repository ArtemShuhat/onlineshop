'use client'

import { type Banner } from '@entities/banner'
import { HeroSection } from '@widgets/hero-section'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'
import { type MouseEvent, useMemo, useState } from 'react'

interface BannerCarouselProps {
	banners: Banner[]
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
	const uniqueBanners = useMemo(() => {
		const seen = new Set<string>()
		return banners.filter(banner => {
			if (seen.has(banner.url)) return false
			seen.add(banner.url)
			return true
		})
	}, [banners])

	if (!uniqueBanners.length) {
		return <HeroSection />
	}

	if (uniqueBanners.length === 1) {
		const banner = uniqueBanners[0]
		return (
			<section className='mx-auto max-w-[1920px] max-sm:px-3 max-sm:py-4'>
				<div className='relative h-[650px] w-full overflow-hidden max-sm:h-[400px] max-md:h-[300px]'>
					<Image
						src={banner.url}
						alt={`Banner ${banner.id}`}
						fill
						className='object-cover'
						priority
						loading='eager'
						fetchPriority='high'
						sizes='100vw'
					/>
				</div>
			</section>
		)
	}

	return <BannerCarouselSlider banners={uniqueBanners} />
}

interface BannerCarouselSliderProps {
	banners: Banner[]
}

function BannerCarouselSlider({ banners }: BannerCarouselSliderProps) {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)

	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
		initial: 0,
		mode: 'snap',
		loop: banners.length > 1,
		rubberband: false,
		slides: {
			perView: 1,
			spacing: 0
		},
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel)
		},
		created() {
			setLoaded(true)
		}
	})

	return (
		<section className='mx-auto max-w-[1920px] max-sm:px-3 max-sm:py-4'>
			<div className='navigation-wrapper relative'>
				<div
					ref={sliderRef}
					key={banners.map(b => b.id).join('-')}
					className='keen-slider overflow-hidden'
				>
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							className='keen-slider__slide'
							style={{ minWidth: '100%' }}
						>
							<div className='relative h-[650px] w-full max-sm:h-[400px] max-md:h-[300px]'>
								<Image
									src={banner.url}
									alt={`Banner ${banner.id}`}
									fill
									className='object-cover'
									priority={index === 0}
									loading={index === 0 ? 'eager' : 'lazy'}
									fetchPriority={index === 0 ? 'high' : 'auto'}
									sizes='100vw'
								/>
							</div>
						</div>
					))}
				</div>

				{loaded && instanceRef.current && banners.length > 1 && (
					<>
						<Arrow
							left
							onClick={(e: MouseEvent<HTMLButtonElement>) => {
								e.stopPropagation()
								instanceRef.current?.prev()
							}}
							disabled={false}
						/>
						<Arrow
							onClick={(e: MouseEvent<HTMLButtonElement>) => {
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
	onClick: (e: MouseEvent<HTMLButtonElement>) => void
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
