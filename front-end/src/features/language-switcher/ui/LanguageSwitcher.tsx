import { routing } from '@shared/i18n'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

const LOCALE_LABELS: Record<string, string> = {
	uk: 'UA',
	ru: 'RU',
	en: 'EN'
}

export function LanguageSwitcher() {
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()

	const handleSwitch = (newLocale: string) => {
		const segments = pathname.split('/')
		segments[1] = newLocale
		router.push(segments.join('/'))
	}

	return (
		<div className='flex items-center gap-1 rounded-full border border-gray-200 p-0.5'>
			{routing.locales.map(loc => (
				<button
					key={loc}
					onClick={() => handleSwitch(loc)}
					className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
						locale === loc
							? 'bg-black text-white'
							: 'text-gray-500 hover:text-black'
					}`}
				>
					{LOCALE_LABELS[loc]}
				</button>
			))}
		</div>
	)
}
