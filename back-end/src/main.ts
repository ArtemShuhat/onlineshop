import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import IORedis from 'ioredis'

import { AppModule } from './app.module'
import { ms, StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/parse-boolean.util'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true
	})

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow('REDIS_URI'))
	const sessionSecure = parseBoolean(
		config.getOrThrow<string>('SESSION_SECURE')
	)
	const sessionDomain = config.get<string>('SESSION_DOMAIN')

	// Railway/Vercel run behind reverse proxies; trust X-Forwarded-* so secure cookies can be set.
	app.set('trust proxy', 1)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			proxy: sessionSecure,
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				...(sessionDomain ? { domain: sessionDomain } : {}),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: sessionSecure,
				sameSite: sessionSecure ? 'none' : 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	const allowedOrigins = config
		.getOrThrow<string>('ALLOWED_ORIGIN')
		.split(',')
		.map(origin => origin.trim())
		.filter(Boolean)

	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
