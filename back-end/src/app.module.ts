import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { AnalyticsModule } from './analytics/analytics.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { ProviderModule } from './auth/provider/provider.module'
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module'
import { CartModule } from './cart/cart.module'
import { CategoryModule } from './category/category.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { OrderModule } from './order/order.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './product/product.module'
import { RedisModule } from './redis/redis.module'
import { StripeModule } from './stripe/stripe.module'
import { UserModule } from './user/user.module'
import { BannerModule } from './banner/banner.module';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { SearchModule } from './search/search.module';
import { ReviewModule } from './review/review.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		PrismaModule,
		RedisModule,
		AnalyticsModule,
		AuthModule,
		UserModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		ProductModule,
		CategoryModule,
		CartModule,
		OrderModule,
		CloudinaryModule,
		StripeModule,
		BannerModule,
		MeilisearchModule,
		SearchModule,
		ReviewModule,
		CurrencyModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
