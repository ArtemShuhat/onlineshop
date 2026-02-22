'use client'

import { useLoginMutation } from '@features/auth'
import { LoginSchema, TypeLoginSchema } from '@features/auth'
import { AuthWrapper } from '@features/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@shared/ui'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function LoginForm() {
	const t = useTranslations('loginForm')
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [isShowTwoFactor, setIsShowFactor] = useState(false)

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const { login, isLoadingLogin } = useLoginMutation(setIsShowFactor)

	const onSubmit = (values: TypeLoginSchema) => {
		if (recaptchaValue) {
			login({ values, recaptcha: recaptchaValue })
		} else {
			toast.error(t('errors.completeRecaptcha'))
		}
	}

	return (
		<AuthWrapper
			heading={t('heading')}
			description={t('description')}
			backButtonLabel={t('backButtonLabel')}
			backButtonHref='/auth/register'
			isShowSocial
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					{isShowTwoFactor && (
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('fields.code.label')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('fields.code.placeholder')}
											disabled={isLoadingLogin}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{!isShowTwoFactor && (
						<>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('fields.email.label')}</FormLabel>
										<FormControl>
											<Input
												placeholder={t('fields.email.placeholder')}
												disabled={isLoadingLogin}
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<div className='flex items-center justify-between'>
											<FormLabel>{t('fields.password.label')}</FormLabel>
											<Link
												href='/auth/reset-password'
												className='ml-auto inline-block text-sm underline'
											>
												{t('forgotPassword')}
											</Link>
										</div>
										<FormControl>
											<Input
												placeholder={t('fields.password.placeholder')}
												disabled={isLoadingLogin}
												type='password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
					<div className='flex justify-center'>
						<ReCAPTCHA
							sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
							onChange={setRecaptchaValue}
						/>
					</div>
					<Button type='submit' disabled={isLoadingLogin}>
						{t('submit')}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
