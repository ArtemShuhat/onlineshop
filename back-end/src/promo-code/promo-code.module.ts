import { Module } from '@nestjs/common'

import { CartModule } from '@/cart/cart.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { PromoCodeController } from './promo-code.controller'
import { PromoCodeService } from './promo-code.service'

@Module({
	imports: [PrismaModule, CartModule, UserModule],
	controllers: [PromoCodeController],
	providers: [PromoCodeService],
	exports: [PromoCodeService]
})
export class PromoCodeModule {}
