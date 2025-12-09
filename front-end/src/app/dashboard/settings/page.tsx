import { type Metadata } from 'next'

import { SettingsForm } from '@/features/user/components'

export const metadata: Metadata = {
	title: 'Настройка профиля'
}

export default function SettingsPage() {
	return (
		<div className='space-y-4'>
			<SettingsForm />
		</div>
	)
}
