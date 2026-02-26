import { Module } from '@nestjs/common'

import { UserModule } from '@/user/user.module'

import { TranslationController } from './translation.controller'
import { TranslationService } from './translation.service'

@Module({
	imports: [UserModule],
	controllers: [TranslationController],
	providers: [TranslationService],
	exports: [TranslationService]
})
export class TranslationModule {}
