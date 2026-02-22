import { getProductBySlug } from '@entities/product'
import { ProductInfo, ProductTabs } from '@features/product-details'
import { getProductImages } from '@shared/lib'
import { ProductGallery } from '@widgets/product-gallery'
import { ProductPageClientBits } from '@widgets/product-page-client-bits'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 120

type Props = {
	params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
	const t = await getTranslations('productPage')
	const { slug } = await params

	let product
	try {
		product = await getProductBySlug(slug, {
			next: { revalidate: 120 }
		})
	} catch {
		notFound()
	}

	return (
		<div className='container mb-20 max-w-7xl p-6'>
			<nav className='mb-6 text-sm text-gray-500'>
				<Link href='/' className='hover:text-gray-900'>
					{t('home')}
				</Link>
				<span className='mx-2'>&gt;</span>
				<Link href='/' className='hover:text-gray-900'>
					{t('products')}
				</Link>
				<span className='mx-2'>&gt;</span>
				<span className='text-gray-900'>{product.name}</span>
			</nav>

			<div className='mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2'>
				<ProductGallery images={getProductImages(product.productImages)} />
				<ProductInfo product={product} />
			</div>

			<ProductTabs product={product} />
			<ProductPageClientBits product={product} />
		</div>
	)
}
