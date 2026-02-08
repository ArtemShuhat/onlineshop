import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'
import { UserModule } from '../user/user.module'

import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [ReviewController],
	providers: [ReviewService],
	exports: [ReviewService]
})
export class ReviewModule {}
