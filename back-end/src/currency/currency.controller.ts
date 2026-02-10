import { Controller, Get, Query } from '@nestjs/common'

import { CurrencyService } from './currency.service'

@Controller('currency')
export class CurrencyController {
	constructor(private readonly currencyService: CurrencyService) {}

	@Get('convert')
	async convert(
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('amount') amount: string
	) {
		const parsedAmount = Number(amount)
		const result = await this.currencyService.convert(
			from.toUpperCase(),
			to.toUpperCase(),
			parsedAmount
		)

		return {
			from: from.toUpperCase(),
			to: to.toUpperCase(),
			amount: parsedAmount,
			result
		}
	}
}
