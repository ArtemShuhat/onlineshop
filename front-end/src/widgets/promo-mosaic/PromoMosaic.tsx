import Image from 'next/image'
import Link from 'next/link'

const promoCards = {
	top: {
		image: '/promo/332.webp',
		alt: 'WLMouse Huan',
		href: '/search?q=mouse',
		button: 'Смотреть'
	},
	left: {
		image: '/promo/123.webp',
		alt: 'Keyboard promo',
		href: '/search?q=keyboard',
		button: 'Подробнее'
	},
	right: {
		image: '/promo/442.jpg',
		alt: 'Ghost promo',
		href: '/search?q=gaming%20mouse',
		button: 'Купить'
	}
}

export function PromoMosaic() {
	return (
		<section className='mx-auto max-w-[1360px] px-4 py-6'>
			<div className='grid grid-cols-2 gap-5 max-md:grid-cols-1'>
				<div className='col-span-2 max-md:col-span-1'>
					<PromoTile
						card={promoCards.top}
						className='aspect-[2.62/1]'
						priority
					/>
				</div>

				<PromoTile card={promoCards.left} className='aspect-[2.62/1]' />

				<PromoTile card={promoCards.right} className='aspect-[2.62/1]' />
			</div>
		</section>
	)
}

function PromoTile({
	card,
	className,
	priority = false
}: {
	card: {
		image: string
		alt: string
		href: string
		button: string
	}
	className?: string
	priority?: boolean
}) {
	return (
		<Link href={card.href} className='block'>
			<div
				className={`group relative overflow-hidden rounded-[28px] bg-neutral-950 ${className ?? ''}`}
			>
				<Image
					src={card.image}
					alt={card.alt}
					fill
					priority={priority}
					quality={92}
					className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
					sizes='(max-width: 768px) calc(100vw - 2rem), 50vw'
				/>

				<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />

				<div className='absolute bottom-4 right-4 max-sm:bottom-3 max-sm:right-3'>
					<span className='rounded-xl border border-white/70 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm max-sm:px-3 max-sm:py-1.5 max-sm:text-xs'>
						{card.button}
					</span>
				</div>
			</div>
		</Link>
	)
}
