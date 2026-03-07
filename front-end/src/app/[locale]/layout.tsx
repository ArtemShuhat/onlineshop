import { CurrencyProvider } from '@entities/currency'
import {
	CURRENCY_COOKIE_NAME,
	parseCurrency
} from '@entities/currency/model/currency.constants'
import { routing } from '@shared/i18n'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

type AppLocale = 'en' | 'ru' | 'uk'

const SEO_BY_LOCALE: Record<
	AppLocale,
	{
		title: string
		description: string
		ogLocale: 'en_US' | 'ru_RU' | 'uk_UA'
	}
> = {
	en: {
		title: 'Gaming & Esport Store - LTDStore.com',
		description:
			'Online store for gaming gear: mice, keyboards, mousepads and headsets for gaming. Popular brands Logitech, WL Mouse, Lamzu.',
		ogLocale: 'en_US'
	},
	ru: {
		title: 'Магазин игровых девайсов - LTDStore.com',
		description:
			'Интернет-магазин игровых девайсов: мышки, клавиатуры, ковры и гарнитуры для гейминга. Популярные бренды Logitech, WL Mouse, Lamzu.',
		ogLocale: 'ru_RU'
	},
	uk: {
		title: 'Магазин ігрових девайсів - LTDStore.com',
		description:
			'Інтернет-магазин ігрових девайсів: мишки, клавіатури, килимки та гарнітури для геймінгу. Популярні бренди Logitech, WL Mouse, Lamzu.',
		ogLocale: 'uk_UA'
	}
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const currentLocale = routing.locales.includes(locale as any)
		? (locale as AppLocale)
		: routing.defaultLocale
	const seo = SEO_BY_LOCALE[currentLocale]

	return {
		title: seo.title,
		description: seo.description,
		alternates: {
			canonical: `/${currentLocale}`,
			languages: {
				en: '/en',
				ru: '/ru',
				uk: '/uk',
				'x-default': '/en'
			}
		},
		openGraph: {
			type: 'website',
			siteName: 'LTDStore.com',
			locale: seo.ogLocale,
			url: `/${currentLocale}`,
			title: seo.title,
			description: seo.description
		},
		twitter: {
			card: 'summary_large_image',
			title: seo.title,
			description: seo.description
		}
	}
}

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	const cookieStore = await cookies()
	const initialCurrency = parseCurrency(
		cookieStore.get(CURRENCY_COOKIE_NAME)?.value
	)

	const messages = await getMessages()

	return (
		<CurrencyProvider initialCurrency={initialCurrency}>
			<NextIntlClientProvider messages={messages}>
				{children}
			</NextIntlClientProvider>
		</CurrencyProvider>
	)
}
