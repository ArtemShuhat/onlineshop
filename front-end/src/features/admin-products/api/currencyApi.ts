const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export interface ConvertCurrencyParams {
	from: 'USD' | 'EUR' | 'UAH'
	to: 'USD' | 'EUR' | 'UAH'
	amount: number
}

export interface ConvertCurrencyResponse {
	from: string
	to: string
	amount: number
	result: number
}

export async function convertCurrency(
	params: ConvertCurrencyParams
): Promise<ConvertCurrencyResponse> {
	const queryParams = new URLSearchParams({
		from: params.from,
		to: params.to,
		amount: String(params.amount)
	})

	const response = await fetch(
		`${SERVER_URL}/currency/convert?${queryParams.toString()}`,
		{
			credentials: 'include'
		}
	)

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || 'Ошибка конвертации валюты')
	}

	return response.json()
}
