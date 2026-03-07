import { routing } from '@shared/i18n'
import type { MetadataRoute } from 'next'

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteUrl = rawSiteUrl.replace(/\/$/, '')

const localeDisallow = routing.locales.flatMap(locale => [
	`/${locale}/auth*`,
	`/${locale}/cart`,
	`/${locale}/checkout`,
	`/${locale}/orders`,
	`/${locale}/dashboard`,
	`/${locale}/search`,
	`/${locale}/coming-soon`
])

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/_next/', ...localeDisallow]
			}
		],
		host: new URL(siteUrl).host,
		sitemap: `${siteUrl}/sitemap.xml`
	}
}
