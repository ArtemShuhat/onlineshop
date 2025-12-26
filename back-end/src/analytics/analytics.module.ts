import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RedisModule } from 'src/redis/redis.module'
import { UserModule } from 'src/user/user.module'

import { AnalyticsController } from './analytics.controller'
import { AnalyticsService } from './analytics.service'

@Module({
	imports: [PrismaModule, RedisModule, UserModule],
	controllers: [AnalyticsController],
	providers: [AnalyticsService],
	exports: [AnalyticsService]
})
export class AnalyticsModule {}
