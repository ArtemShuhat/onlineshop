'use client'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'

const slides = [
	{ src: '/brand-collage/9.webp', alt: 'Wlmouse Beast X', width: 330 },
	{ src: '/brand-collage/1.jpg', alt: 'PGL Major Stockholm NaVi', width: 330 },
	{
		src: '/brand-collage/3.jpg',
		alt: 'StarLadder Budapest Major Furia',
		width: 340
	},
	{
		src: '/brand-collage/2.jpg',
		alt: 'IEM Krakow Vitality',
		width: 340
	},
	{ src: '/brand-collage/5.jpg', alt: 'IEM Cologne Team Spirit', width: 330 },
	{ src: '/brand-collage/8.webp', alt: 'Final Mouse', width: 300 },
	{
		src: '/brand-collage/4.jpg',
		alt: 'BLAST Rivals Season 2 Apex',
		width: 300
	},
	{ src: '/brand-collage/6.jpg', alt: 'HLTV Awards 2025 donk', width: 300 },
	{
		src: '/brand-collage/7.jpg',
		alt: 'Esports World Cup 2025 m0NESY',
		width: 300
	}
]

export function BrandCollage() {
	const [sliderRef] = useKeenSlider<HTMLDivElement>({
		loop: true,
		mode: 'free-snap',
		drag: true,
		renderMode: 'performance',
		slides: {
			perView: 'auto',
			spacing: 0
		}
	})

	return (
		<section className='overflow-hidden'>
			<div ref={sliderRef} className='keen-slider'>
				{slides.map(slide => (
					<div
						key={slide.src}
						className='keen-slider__slide relative h-[260px] shrink-0 max-sm:h-[180px] max-xs:items-center'
						style={{ width: `${slide.width}px` }}
					>
						<Image
							src={slide.src}
							alt={slide.alt}
							fill
							unoptimized
							className='object-cover'
							sizes='(max-width: 640px) 220px, (max-width: 1024px) 300px, 340px'
						/>
					</div>
				))}
			</div>
		</section>
	)
}
