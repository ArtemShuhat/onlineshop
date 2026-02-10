import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class CurrencyService {
	constructor(private readonly http: HttpService) {}

	async convert(from: string, to: string, amount: number): Promise<number> {
		if (from === to) {
			return amount
		}

		const rates = await this.getRates()

		const fromRate = this.findRate(rates, from)
		const toRate = this.findRate(rates, to)

		const amountInUAH = amount * fromRate
		const result = amountInUAH / toRate

		return Number(result.toFixed(2))
	}

	private async getRates(): Promise<any[]> {
		const url =
			'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'

		const { data } = await firstValueFrom(this.http.get(url))
		return data
	}

	private findRate(rates: any[], code: string): number {
		if (code === 'UAH') {
			return 1
		}

		const item = rates.find(
			r => r.ccy === code || r.base_ccy === code || r.currency === code
		)

		if (!item) {
			throw new Error(`Rate for currency ${code} not found`)
		}

		const rate = Number(item.sale || item.buy)
		if (!rate || isNaN(rate)) {
			throw new Error(`Bad rate for currency ${code}`)
		}

		return rate
	}
}
