import { type Product, getProductBySlug } from '@entities/product'
import { ProductInfo, ProductTabs } from '@features/product-details'
import { routing } from '@shared/i18n'
import { getProductImages } from '@shared/lib'
import { ProductGallery } from '@widgets/product-gallery'
import { ProductPageClientBits } from '@widgets/product-page-client-bits'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const revalidate = 120

type Locale = 'en' | 'ru' | 'uk'

type Props = {
	params: Promise<{ locale: string; slug: string }>
}

const OG_LOCALE_BY_LOCALE: Record<Locale, 'en_US' | 'ru_RU' | 'uk_UA'> = {
	en: 'en_US',
	ru: 'ru_RU',
	uk: 'uk_UA'
}

const getProductCached = cache(async (slug: string) => {
	return getProductBySlug(slug, {
		next: { revalidate: 120 }
	})
})

function getLocale(locale: string): Locale {
	return routing.locales.includes(locale as any) ? (locale as Locale) : 'en'
}

function getProductDescription(product: Product, locale: Locale): string {
	const localized =
		locale === 'ru'
			? product.descriptionRu
			: locale === 'uk'
				? product.descriptionUk
				: product.descriptionEn

	return (
		localized ||
		product.descriptionEn ||
		product.descriptionRu ||
		product.descriptionUk ||
		''
	)
}

function normalizeDescription(value: string, maxLength: number = 160): string {
	return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function productPath(locale: Locale, slug: string): string {
	return `/${locale}/products/${slug}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, slug } = await params
	const currentLocale = getLocale(locale)

	let product: Product
	try {
		product = await getProductCached(slug)
	} catch {
		return {
			title: 'Product not found - LTDStore.com',
			robots: { index: false, follow: false }
		}
	}

	const title = `${product.name} - LTDStore.com`
	const description = normalizeDescription(
		getProductDescription(product, currentLocale)
	)
	const firstImage = getProductImages(product.productImages)[0]

	return {
		title,
		description,
		alternates: {
			canonical: productPath(currentLocale, slug),
			languages: {
				en: productPath('en', slug),
				ru: productPath('ru', slug),
				uk: productPath('uk', slug),
				'x-default': productPath('en', slug)
			}
		},
		openGraph: {
			type: 'website',
			siteName: 'LTDStore.com',
			locale: OG_LOCALE_BY_LOCALE[currentLocale],
			url: productPath(currentLocale, slug),
			title,
			description,
			images: firstImage ? [{ url: firstImage, alt: product.name }] : undefined
		},
		twitter: {
			card: firstImage ? 'summary_large_image' : 'summary',
			title,
			description,
			images: firstImage ? [firstImage] : undefined
		},
		robots: {
			index: true,
			follow: true
		}
	}
}

export default async function ProductPage({ params }: Props) {
	const t = await getTranslations('productPage')
	const { slug } = await params

	let product: Product
	try {
		product = await getProductCached(slug)
	} catch {
		notFound()
	}

	return (
		<div className='container mb-20 max-w-7xl p-6 max-xs:mb-5'>
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
