'use client'

import { useState } from 'react'

interface ProductGalleryProps {
	images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0)

	if (images.length === 0) {
		return (
			<div className='flex h-[500px] items-center justify-center rounded-lg bg-gray-100 max-md:h-[400px]'>
				<p className='text-gray-400'>Нет изображений</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='aspect-square w-full overflow-hidden rounded-lg border bg-gray-100 max-md:aspect-auto max-md:h-[450px]'>
				<img
					src={images[selectedImage]}
					alt='Product'
					className='h-full w-full object-contain'
				/>
			</div>

			{images.length > 1 && (
				<div className='grid grid-cols-5 gap-3 max-md:grid-cols-6 max-md:gap-2 '>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedImage(index)}
							className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
								selectedImage === index
									? 'border-pur'
									: 'border-gray-200 hover:border-gray-400'
							}`}
						>
							<img
								src={image}
								alt={`Thumbnail ${index + 1}`}
								className='h-full w-full object-cover'
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
