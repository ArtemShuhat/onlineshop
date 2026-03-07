import { getProductsPage } from '@entities/product'
import type { MetadataRoute } from 'next'

const LOCALES = ['en', 'ru', 'uk'] as const
type Locale = (typeof LOCALES)[number]

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteUrl = rawSiteUrl.replace(/\/$/, '')

export const revalidate = 3600

function absolute(path: string): string {
	return new URL(path, `${siteUrl}/`).toString()
}

function getLocalePaths(path: string): Record<Locale, string> {
	const normalized = path.startsWith('/') ? path : `/${path}`
	const suffix = normalized === '/' ? '' : normalized

	return {
		en: `/en${suffix}`,
		ru: `/ru${suffix}`,
		uk: `/uk${suffix}`
	}
}

function buildLocalizedEntries(
	path: string,
	options: {
		lastModified: Date
		changeFrequency: 'daily' | 'weekly'
		priority: number
	}
): MetadataRoute.Sitemap {
	const paths = getLocalePaths(path)
	const languages = {
		en: absolute(paths.en),
		ru: absolute(paths.ru),
		uk: absolute(paths.uk)
	}

	return LOCALES.map(locale => ({
		url: absolute(paths[locale]),
		lastModified: options.lastModified,
		changeFrequency: options.changeFrequency,
		priority: options.priority,
		alternates: { languages }
	}))
}

async function getAllProductSlugs(): Promise<string[]> {
	const limit = 200

	const firstPage = await getProductsPage(
		{ page: 1, limit },
		{ next: { revalidate: 3600 } }
	)

	const slugs = new Set(
		firstPage.items.map(product => product.slug).filter(Boolean)
	)

	const totalPages = firstPage.pagination.totalPages

	if (totalPages > 1) {
		const restPages = await Promise.all(
			Array.from({ length: totalPages - 1 }, (_, i) =>
				getProductsPage({ page: i + 2, limit }, { next: { revalidate: 3600 } })
			)
		)

		for (const page of restPages) {
			for (const product of page.items) {
				if (product.slug) slugs.add(product.slug)
			}
		}
	}

	return [...slugs]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date()

	const entries: MetadataRoute.Sitemap = [
		...buildLocalizedEntries('/', {
			lastModified: now,
			changeFrequency: 'daily',
			priority: 1
		})
	]

	try {
		const slugs = await getAllProductSlugs()

		for (const slug of slugs) {
			entries.push(
				...buildLocalizedEntries(`/products/${encodeURIComponent(slug)}`, {
					lastModified: now,
					changeFrequency: 'weekly',
					priority: 0.8
				})
			)
		}
	} catch {}

	return entries
}
