import { CurrencyProvider } from '@entities/currency'
import {
	CURRENCY_COOKIE_NAME,
	parseCurrency
} from '@entities/currency/model/currency.constants'
import { routing } from '@shared/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

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
