import localFont from 'next/font/local'

const brandTickerFont = localFont({
	src: '../fonts/DrukText-MediumItalic-Trial.otf',
	weight: '700',
	display: 'swap'
})

const items = new Array(10).fill('#PLAYTOWIN')

export function BrandTicker() {
	return (
		<section className='overflow-hidden bg-white py-5'>
			<div className='ticker-track flex w-max min-w-full shrink-0 items-center'>
				<div className='ticker-group flex shrink-0 items-center'>
					{items.map((item, index) => (
						<span
							key={`first-${index}`}
							className={`${brandTickerFont.className} mx-10 text-4xl font-black uppercase tracking-tight text-black max-sm:mx-6 max-sm:text-2xl`}
						>
							{item}
						</span>
					))}
				</div>

				<div
					aria-hidden='true'
					className='ticker-group flex shrink-0 items-center'
				>
					{items.map((item, index) => (
						<span
							key={`second-${index}`}
							className={`${brandTickerFont.className} mx-10 text-[32px] font-black uppercase tracking-tight text-black max-sm:mx-6 max-sm:text-2xl`}
						>
							{item}
						</span>
					))}
				</div>
			</div>
		</section>
	)
}
