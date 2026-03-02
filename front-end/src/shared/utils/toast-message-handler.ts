import { toast } from 'sonner'

function getServerErrorMessage() {
	if (typeof window === 'undefined') return 'Server error'
	const locale = window.location.pathname.split('/')[1]

	if (locale === 'ru') return 'Ошибка со стороны сервера'
	if (locale === 'uk') return 'Помилка з боку сервера'
	return 'Server error'
}

function getErrorMessage(error: unknown, fallbackMessage?: string) {
	if (typeof error === 'string' && error.trim()) {
		return error.trim()
	}

	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof error.message === 'string' &&
		error.message.trim()
	) {
		return error.message.trim()
	}

	return fallbackMessage || getServerErrorMessage()
}

interface ToastMessageHandlerOptions {
	fallbackMessage?: string
	id?: string
}

export function toastMessageHandler(
	error: unknown,
	options: ToastMessageHandlerOptions = {}
) {
	const errorMessage = getErrorMessage(error, options.fallbackMessage)
	const firstDotIndex = errorMessage.indexOf('.')

	if (firstDotIndex !== -1) {
		toast.error(errorMessage.slice(0, firstDotIndex), {
			id: options.id,
			description: errorMessage.slice(firstDotIndex + 1).trim()
		})
	} else {
		toast.error(errorMessage, {
			id: options.id
		})
	}
}
