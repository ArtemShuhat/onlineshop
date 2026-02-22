'use client'

import { GradientText } from '@shared/components'
import { LightRays } from '@shared/components'
import { Badge } from '@shared/ui'
import { Button } from '@shared/ui'
import { Card } from '@shared/ui'
import { ArrowRight, Clock, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ComingSoonPage() {
	const [email, setEmail] = useState('')
	const [subscribed, setSubscribed] = useState(false)

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault()
		setSubscribed(true)
		setTimeout(() => setSubscribed(false), 3000)
	}

	return (
		<div className='relative min-h-screen overflow-hidden bg-black'>
			<div
				style={{
					width: '100%',
					height: '100vh',
					position: 'absolute',
					top: 0,
					left: 0
				}}
				className='pointer-events-none'
			>
				<LightRays
					raysOrigin='top-center'
					raysColor='#ffffff'
					raysSpeed={1.5}
					lightSpread={0.8}
					rayLength={1.2}
					followMouse={true}
					mouseInfluence={0.1}
					noiseAmount={0.1}
					distortion={0.05}
					className='custom-rays'
				/>
			</div>
			<div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4'>
				<div className='animate-fade-in-up mb-8'>
					<Badge className='gap-2 border-purple-500/30 bg-purple-500/10 px-4 py-2 text-purple-300 backdrop-blur-sm hover:bg-purple-500/20'>
						<Sparkles className='h-4 w-4' />
						Скоро запуск
					</Badge>
				</div>

				<h1 className='animate-fade-in-up animation-delay-100 mb-6 max-w-4xl text-center text-5xl font-bold leading-tight text-white md:text-7xl'>
					<span>
						Что-то{' '}
						<GradientText
							colors={['#6D28D9', '#9b89c4', '#6D28D9', '#9b89c4', '#6D28D9']}
							animationSpeed={7}
							showBorder={false}
							className='custom-class'
						>
							невероятное
						</GradientText>
					</span>
					<br /> на подходе
				</h1>

				<p className='animate-fade-in-up animation-delay-200 mb-12 max-w-2xl text-center text-lg text-gray-300 md:text-xl'>
					Мы усердно работаем над чем-то особенным. Подпишитесь, чтобы первыми
					узнать о запуске и получить эксклюзивные предложения.
				</p>

				<div className='animate-fade-in-up animation-delay-300 mb-16 w-full max-w-md'>
					<Card className='border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md'>
						{subscribed ? (
							<div className='flex flex-col items-center gap-4 py-4 text-center'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20'>
									<Mail className='h-6 w-6 text-green-400' />
								</div>
								<p className='font-semibold text-white'>Спасибо за подписку!</p>
								<p className='text-sm text-gray-400'>
									Мы отправим вам письмо при запуске.
								</p>
							</div>
						) : (
							<form onSubmit={handleSubscribe} className='space-y-4'>
								<div>
									<label
										htmlFor='email'
										className='mb-2 block text-sm font-medium text-gray-300'
									>
										Email адрес
									</label>
									<input
										type='email'
										id='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
										placeholder='your@email.com'
										required
										className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-colors focus:outline-none'
									/>
								</div>
								<Button
									type='submit'
									className='w-full gap-2 bg-purh hover:bg-pura'
								>
									Получить уведомление
									<ArrowRight className='h-4 w-4' />
								</Button>
							</form>
						)}
					</Card>
				</div>

				<div className='animate-fade-in-up animation-delay-400 grid max-w-4xl gap-6 md:grid-cols-3'>
					<Card className='border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20'>
						<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20'>
							<Clock className='h-6 w-6 text-purple-400' />
						</div>
						<h3 className='mb-2 font-semibold text-white'>
							Запуск совсем скоро
						</h3>
						<p className='text-sm text-gray-400'>
							Мы активно работаем над финальными деталями.
						</p>
					</Card>

					<Card className='border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-blue-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20'>
						<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20'>
							<Sparkles className='h-6 w-6 text-blue-400' />
						</div>
						<h3 className='mb-2 font-semibold text-white'>Уникальный опыт</h3>
						<p className='text-sm text-gray-400'>
							Готовим для вас что-то действительно особенное.
						</p>
					</Card>

					<Card className='border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:scale-105 hover:border-pink-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-pink-500/20'>
						<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20'>
							<Mail className='h-6 w-6 text-pink-400' />
						</div>
						<h3 className='mb-2 font-semibold text-white'>Будьте в курсе</h3>
						<p className='text-sm text-gray-400'>
							Подпишитесь, чтобы не пропустить запуск.
						</p>
					</Card>
				</div>

				<div className='animate-fade-in-up animation-delay-500 mt-12'>
					<Link
						href='/'
						className='text-sm text-gray-400 transition-colors hover:text-purple-400'
					>
						← Вернуться на главную
					</Link>
				</div>
			</div>
		</div>
	)
}
