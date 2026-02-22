import { ProfileSettings } from '@features/user'
import { Footer } from '@widgets/footer'
import { Header } from '@widgets/header'
import { type Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Настройки профиля'
}

export default function SettingsPage() {
	return (
		<>
			<ProfileSettings />
		</>
	)
}
