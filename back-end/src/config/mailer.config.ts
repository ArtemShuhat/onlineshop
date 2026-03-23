import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

const SMTP_SSL_PORTS = new Set([465, 2465])

const parseBoolean = (value?: string) => value?.toLowerCase() === 'true'

export const getMailerConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => {
	const port = Number(configService.getOrThrow<string>('MAIL_PORT'))
	const secureFromEnv = configService.get<string>('MAIL_SECURE')
	const secure =
		secureFromEnv !== undefined
			? parseBoolean(secureFromEnv)
			: SMTP_SSL_PORTS.has(port)

	const from =
		configService.get<string>('MAIL_FROM') ??
		`"Online shop team" <${configService.getOrThrow<string>('MAIL_LOGIN')}>`

	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port,
			secure,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD')
			}
		},
		defaults: {
			from
		}
	}
}
