import { toast } from 'sonner'

function getServerErrorMessage() {
	if (typeof window === 'undefined') return 'Server error'
	const locale = window.location.pathname.split('/')[1]

	if (locale === 'ru') return 'Ошибка со стороны сервера'
	if (locale === 'uk') return 'Помилка з боку сервера'
	return 'Server error'
}

export function toastMessageHandler(error: Error) {
	if (error.message) {
		const errorMessage = error.message
		const firstDotIndex = errorMessage.indexOf('.')

		if (firstDotIndex !== -1) {
			toast.error(errorMessage.slice(0, firstDotIndex), {
				description: errorMessage.slice(firstDotIndex + 1)
			})
		} else {
			toast.error(errorMessage)
		}
	} else {
		toast.error(getServerErrorMessage())
	}
}
