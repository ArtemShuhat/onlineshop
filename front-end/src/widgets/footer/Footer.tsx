import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='border-t border-gray-200 bg-white'>
			<div className='mx-auto max-w-[1280px] px-4 py-12'>
				<div className='grid grid-cols-2 gap-8 md:grid-cols-5'>
					{/* Информация */}
					<div>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>
							Информация
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/about'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									О нас
								</Link>
							</li>
							<li>
								<Link
									href='/contacts'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Контакты
								</Link>
							</li>
							<li>
								<Link
									href='/careers'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Карьера
								</Link>
							</li>
						</ul>
					</div>

					{/* Услуги */}
					<div>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>Услуги</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/delivery'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Доставка
								</Link>
							</li>
							<li>
								<Link
									href='/payment'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Оплата
								</Link>
							</li>
							<li>
								<Link
									href='/warranty'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Гарантия
								</Link>
							</li>
							<li>
								<Link
									href='/returns'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Возврат товара
								</Link>
							</li>
						</ul>
					</div>

					{/* Покупателям */}
					<div>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>
							Покупателям
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/faq'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Часто задаваемые вопросы
								</Link>
							</li>
							<li>
								<Link
									href='/how-to-order'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Как сделать заказ
								</Link>
							</li>
							<li>
								<Link
									href='/payment-methods'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Способы оплаты
								</Link>
							</li>
							<li>
								<Link
									href='/privacy'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Конфиденциальность
								</Link>
							</li>
						</ul>
					</div>

					{/* Категории */}
					<div>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>
							Категории
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/catalog/electronics'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Электроника
								</Link>
							</li>
							<li>
								<Link
									href='/catalog/accessories'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Аксессуары
								</Link>
							</li>
							<li>
								<Link
									href='/catalog/audio'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Аудио
								</Link>
							</li>
							<li>
								<Link
									href='/catalog/gadgets'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Гаджеты
								</Link>
							</li>
						</ul>
					</div>

					{/* Компания */}
					<div>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>
							Компания
						</h3>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/coming-soon'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Блог
								</Link>
							</li>
							<li>
								<Link
									href='/news'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Новости
								</Link>
							</li>
							<li>
								<Link
									href='/reviews'
									className='text-sm text-gray-600 hover:text-gray-900'
								>
									Отзывы
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Социальные сети */}
				<div className='mt-12 flex justify-center gap-6 border-t border-gray-200 pt-8'>
					<a
						href='https://facebook.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 transition-colors hover:text-gray-900'
						aria-label='Facebook'
					>
						<Facebook className='h-5 w-5' />
					</a>
					<a
						href='https://instagram.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 transition-colors hover:text-gray-900'
						aria-label='Instagram'
					>
						<Instagram className='h-5 w-5' />
					</a>
					<a
						href='https://youtube.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 transition-colors hover:text-gray-900'
						aria-label='YouTube'
					>
						<Youtube className='h-5 w-5' />
					</a>
					<a
						href='https://twitter.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 transition-colors hover:text-gray-900'
						aria-label='Twitter'
					>
						<Twitter className='h-5 w-5' />
					</a>
					<a
						href='https://linkedin.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 transition-colors hover:text-gray-900'
						aria-label='LinkedIn'
					>
						<Linkedin className='h-5 w-5' />
					</a>
				</div>

				{/* Copyright */}
				<div className='mt-8 text-center'>
					<p className='text-xs text-gray-500'>
						© Copyright {new Date().getFullYear()} Интернет-магазин. Все права
						защищены.
					</p>
				</div>
			</div>
		</footer>
	)
}
