import { type Banner } from '@entities/banner'
import Image from 'next/image'

interface PromoMosaicProps {
	banners: Banner[]
}

export function PromoMosaic({ banners }: PromoMosaicProps) {
	const uniqueBanners = banners.filter(
		(banner, index, array) =>
			array.findIndex(candidate => candidate.url === banner.url) === index
	)

	if (!uniqueBanners.length) {
		return null
	}

	const featuredBanner = uniqueBanners[0]
	const bottomBanners = uniqueBanners.slice(1, 3)

	return (
		<section className='mx-auto max-w-[1360px] px-4 py-6'>
			<div className='grid grid-cols-2 gap-5 max-xs:grid-cols-1'>
				<div className='relative col-span-2 aspect-[2.62/1] overflow-hidden rounded-[28px] bg-black max-xs:col-span-1'>
					<Image
						src={featuredBanner.url}
						alt={`Banner ${featuredBanner.id}`}
						fill
						className='object-cover'
						priority
						loading='eager'
						fetchPriority='high'
						sizes='(max-width: 768px) calc(100vw - 2rem), 1360px'
					/>
				</div>

				{bottomBanners.map(banner => (
					<div
						key={banner.id}
						className={`relative aspect-[2.62/1] overflow-hidden rounded-[28px] bg-black  ${
							bottomBanners.length === 1
								? 'col-span-2 max-xs:col-span-1'
								: ''
						}`}
					>
						<Image
							src={banner.url}
							alt={`Banner ${banner.id}`}
							fill
							className='object-cover'
							sizes='(max-width: 768px) calc(100vw - 2rem), 50vw'
						/>
					</div>
				))}
			</div>
		</section>
	)
}
