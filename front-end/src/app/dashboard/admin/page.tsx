import { BarChart3, ImageIcon, Package, ShoppingCart, Tag } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
	return (
		<div className='p-8'>
			<h1 className='mb-8 text-3xl font-bold'>Адміністративна панель</h1>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				<Link
					href='/dashboard/admin/products'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<Package className='mb-4 h-8 w-8 text-blue-600' />
					<h2 className='mb-2 text-xl font-semibold'>Товари</h2>
					<p className='text-gray-600'>Керування товарами та категоріями</p>
				</Link>

				<Link
					href='/dashboard/admin/orders'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<ShoppingCart className='mb-4 h-8 w-8 text-green-600' />
					<h2 className='mb-2 text-xl font-semibold'>Замовлення</h2>
					<p className='text-gray-600'>Перегляд та обробка замовлень</p>
				</Link>

				<Link
					href='/dashboard/admin/categories'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<Tag className='mb-4 h-8 w-8 text-purple-600' />
					<h2 className='mb-2 text-xl font-semibold'>Категорії</h2>
					<p className='text-gray-600'>Керування категоріями товарів</p>
				</Link>

				<Link
					href='/dashboard/admin/analytics'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<BarChart3 className='mb-4 h-8 w-8 text-orange-600' />
					<h2 className='mb-2 text-xl font-semibold'>Аналітика</h2>
					<p className='text-gray-600'>Статистика та звіти</p>
				</Link>

				<Link
					href='/dashboard/admin/banners'
					className='rounded-lg border p-6 transition-all hover:shadow-lg'
				>
					<ImageIcon className='mb-4 h-8 w-8 text-pink-600' />
					<h2 className='mb-2 text-xl font-semibold'>Карусель</h2>
					<p className='text-gray-600'>Керування банерами</p>
				</Link>
			</div>
		</div>
	)
}
