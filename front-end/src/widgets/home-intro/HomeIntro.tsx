import { getTranslations } from 'next-intl/server'

export async function HomeIntro() {
	const t = await getTranslations('userPage.homeIntro')

	return (
		<section className='mx-auto max-w-[1280px] px-4 pb-10 max-sm:px-3 max-sm:py-8'>
			<div className=''>
				<p className='mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500'>
					LTD Store
				</p>

				<h1 className='mx-auto max-w-3xl text-balance text-center text-4xl font-extrabold leading-tight text-zinc-900 max-sm:text-3xl'>
					{t('title')}
				</h1>

				<div className='mx-auto mt-5 max-w-5xl space-y-4 text-center text-[15px] leading-7 text-zinc-700 max-sm:text-sm max-sm:leading-6'>
					<p>{t('welcome')}</p>
					<p>{t('brands')}</p>
					<p>{t('products')}</p>
				</div>

				<h2 className='mt-8 text-center text-2xl font-bold leading-tight text-zinc-900 max-sm:text-xl'>
					{t('improvingTitle')}
				</h2>

				<div className='mx-auto mt-4 max-w-4xl space-y-4 text-center text-[15px] leading-7 text-zinc-700 max-sm:text-sm max-sm:leading-6'>
					<p>{t('improvingText')}</p>
					<p>{t('feedbackText')}</p>
				</div>

				<p className='mx-auto mt-6 max-w-3xl pt-4 text-center text-sm font-semibold text-zinc-900'>
					{t('outro')}
				</p>
			</div>
		</section>
	)
}
