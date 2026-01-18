import { FC } from 'react'

const FeaturesSection: FC = () => {
	return (
		<section className='max-lg:my-25 my-40 border-b border-t border-gray-200 bg-gray-50 py-4 max-md:my-20'>
			<div className='mx-auto max-w-[1280px] px-4'>
				<div className='flex items-center justify-around gap-8'>
					<div className='flex items-center gap-3'>
						<svg
							className='h-6 w-6 flex-shrink-0 text-gray-700'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
						</svg>
						<span className='text-sm text-gray-700'>Оригинальные товары</span>
					</div>
					<div className='flex items-center gap-3'>
						<svg
							className='h-6 w-6 flex-shrink-0 text-gray-700'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' />
						</svg>
						<span className='text-sm text-gray-700'>
							Удобная система лояльности
						</span>
					</div>
					<div className='flex items-center gap-3'>
						<svg
							className='h-6 w-6 flex-shrink-0 text-gray-700'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' />
						</svg>
						<span className='text-sm text-gray-700'>
							Тысячи довольных клиентов
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}

export default FeaturesSection
