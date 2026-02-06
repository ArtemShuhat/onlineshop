import { BarChart3, ImageIcon, Package, ShoppingCart, Tag } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
	return (
		<div className='p-8'>
			<h1 className='mb-8 text-3xl font-bold'>Административная панель</h1>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				<Link
					href='/dashboard/admin/products'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<Package className='mb-4 h-8 w-8 text-blue-600' />
					<h2 className='mb-2 text-xl font-semibold'>Товары</h2>
					<p className='text-gray-600'>Управление товарами и категориями</p>
				</Link>

				<Link
					href='/dashboard/admin/orders'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<ShoppingCart className='mb-4 h-8 w-8 text-green-600' />
					<h2 className='mb-2 text-xl font-semibold'>Заказы</h2>
					<p className='text-gray-600'>Просмотр и обработка заказов</p>
				</Link>

				<Link
					href='/dashboard/admin/categories'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<Tag className='mb-4 h-8 w-8 text-purple-600' />
					<h2 className='mb-2 text-xl font-semibold'>Категории</h2>
					<p className='text-gray-600'>Управление категориями товаров</p>
				</Link>

				<Link
					href='/dashboard/admin/analytics'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<BarChart3 className='mb-4 h-8 w-8 text-orange-600' />
					<h2 className='mb-2 text-xl font-semibold'>Аналитика</h2>
					<p className='text-gray-600'>Статистика и отчеты</p>
				</Link>

				<Link
					href='/dashboard/admin/banners'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<ImageIcon className='mb-4 h-8 w-8 text-pink-600' />
					<h2 className='mb-2 text-xl font-semibold'>Карусель</h2>
					<p className='text-gray-600'>Управление баннерами</p>
				</Link>
			</div>
		</div>
	)
}
