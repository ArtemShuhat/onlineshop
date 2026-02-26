import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class TranslationService {
	async translate(text: string, targetLang: 'EN' | 'UK'): Promise<string> {
		const apiKey = process.env.DEEPL_API_KEY

		if (!apiKey) {
			throw new BadRequestException('DeepL API key не найден')
		}

		const deeplTargetLang = targetLang === 'EN' ? 'EN-US' : 'UK'
		const baseUrl = 'https://api-free.deepl.com/v2/translate'

		const response = await fetch(baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `DeepL-Auth-Key ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: [text],
				target_lang: deeplTargetLang
			})
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new BadRequestException(
				(errorData as any).message || `DeepL error: ${response.status}`
			)
		}

		const data = (await response.json()) as { translations: { text: string[] } }

		return data.translations[0].text
	}
}
