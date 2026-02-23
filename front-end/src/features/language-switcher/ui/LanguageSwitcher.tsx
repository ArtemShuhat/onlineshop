import { routing } from '@shared/i18n'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@shared/ui'
import { Check, ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

const LOCALE_LABELS: Record<string, string> = {
	uk: 'uk',
	ru: 'ru',
	en: 'en'
}

export function LanguageSwitcher() {
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const currentLocale = LOCALE_LABELS[locale] ?? 'en'

	const handleSwitch = (newLocale: string) => {
		const segments = pathname.split('/')
		segments[1] = newLocale
		router.push(segments.join('/'))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label='Switch language'
				className='inline-flex h-8 items-center rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50'
			>
				{currentLocale}
				<ChevronDown className='ml-1 h-3.5 w-3.5 text-zinc-500' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-[88px] rounded-xl p-1'>
				{routing.locales.map(loc => (
					<DropdownMenuItem
						key={loc}
						onClick={() => handleSwitch(loc)}
						className={`cursor-pointer rounded-lg px-2 py-1.5 text-sm ${
							locale === loc
								? 'bg-zinc-100 font-semibold text-zinc-900'
								: 'text-zinc-600'
						}`}
					>
						<span>{LOCALE_LABELS[loc] ?? loc}</span>
						{locale === loc && <Check className='ml-auto h-3.5 w-3.5' />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
