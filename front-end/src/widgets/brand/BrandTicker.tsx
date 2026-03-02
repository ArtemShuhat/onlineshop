import localFont from 'next/font/local'

const brandTickerFont = localFont({
	src: '../../shared/fonts/DrukText-MediumItalic-Trial.otf',
	weight: '700',
	display: 'swap'
})

const items = new Array(10).fill('#PLAYTOWIN')
const itemClassName = `${brandTickerFont.className} mx-10 whitespace-nowrap text-[32px] uppercase tracking-tight leading-none text-black max-sm:mx-6 max-sm:text-2xl`

export function BrandTicker() {
	return (
		<section className='overflow-hidden bg-white py-5'>
			<div className='ticker-track flex w-max items-center'>
				<div className='ticker-group flex shrink-0 items-center'>
					{items.map((item, index) => (
						<span key={`first-${index}`} className={itemClassName}>
							{item}
						</span>
					))}
				</div>

				<div
					aria-hidden='true'
					className='ticker-group flex shrink-0 items-center'
				>
					{items.map((item, index) => (
						<span key={`second-${index}`} className={itemClassName}>
							{item}
						</span>
					))}
				</div>
			</div>
		</section>
	)
}
