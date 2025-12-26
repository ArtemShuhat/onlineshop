import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { UserRole } from '__generated__'

import { Roles } from '@/auth/decorators/roles.decorator'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { RolesGuard } from '@/auth/guards/roles.guard'

import { AnalyticsService } from './analytics.service'
import { StatsQueryDto } from './dto/stats-query.dto'

@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('overview')
	async getOverview() {
		return this.analyticsService.getOverallMetrics()
	}

	@Get('period')
	async getPeriodStats(@Query() dto: StatsQueryDto) {
		const startDate = new Date(dto.startDate)
		const endDate = new Date(dto.endDate)
		return this.analyticsService.getStatsForPeriod(startDate, endDate)
	}

	@Get('top-products')
	async getTopProducts(
		@Query('metric') metric: 'views' | 'sales' | 'revenue' = 'views',
		@Query('limit') limit: number = 10
	) {
		return this.analyticsService.getTopProducts(metric, +limit)
	}
}
