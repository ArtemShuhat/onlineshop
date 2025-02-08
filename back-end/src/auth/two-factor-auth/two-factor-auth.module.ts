import { Module } from '@nestjs/common'

import { MailService } from '@/libs/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'

import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	providers: [TwoFactorAuthService, MailService, PrismaService]
})
export class TwoFactorAuthModule {}
