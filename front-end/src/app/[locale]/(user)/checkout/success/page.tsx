import Link from 'next/link'

type Props = {
	searchParams: Promise<{ orderId?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
	const { orderId } = await searchParams

	return (
		<>
			<div className='mx-auto min-h-screen max-w-2xl px-4 py-20 text-center'>
				<div className='rounded-lg bg-white p-12 shadow-lg'>
					<div className='mb-6 flex justify-center'>
						<div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
							<svg
								className='h-12 w-12 text-green-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
						</div>
					</div>

					<h1 className='mb-4 text-3xl font-bold text-gray-900'>
						Заказ успешно оформлено!
					</h1>

					<p className='mb-2 text-gray-600'>
						Ваш номер заказа: <strong>#{orderId}</strong>
					</p>

					<p className='mb-8 text-gray-600'>
						Мы отправили подтверждение на вашу электронную почту.
						<br />
						Статус заказа изменится на «Оплачен» в течение 1 минуты.
					</p>

					<div className='flex justify-center gap-4'>
						<Link
							href='/orders'
							className='rounded-lg bg-pur px-6 py-3 font-semibold text-white transition hover:bg-purh'
						>
							Мои заказы
						</Link>
						<Link
							href='/'
							className='rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300'
						>
							На главную
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}
