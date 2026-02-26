const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function translateText(
	text: string,
	targetLang: 'EN' | 'UK'
): Promise<string> {
	const response = await fetch(`${SERVER_URL}/translation/translate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ text, targetLang })
	})

	if (!response.ok) {
		const error = await response.json().catch(() => ({}))
		throw new Error((error as any).message || 'Ошибка перевода')
	}

	const data = await response.json()
	return data.translatedText
}
