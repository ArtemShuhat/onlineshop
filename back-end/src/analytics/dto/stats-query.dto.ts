import { IsDateString, IsNotEmpty } from 'class-validator'

export class StatsQueryDto {
	@IsNotEmpty()
	@IsDateString()
	startDate: string

	@IsNotEmpty()
	@IsDateString()
	endDate: string
}
