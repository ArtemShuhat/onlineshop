'use client'

import { useResetPasswordMutation } from '@features/auth'
import { ResetPasswordSchema, TypeResetPasswordSchema } from '@features/auth'
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
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ResetPasswordForm() {
	const t = useTranslations('resetPasswordForm')
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<TypeResetPasswordSchema>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const { reset, isLoadingReset } = useResetPasswordMutation()

	const onSubmit = (values: TypeResetPasswordSchema) => {
		if (recaptchaValue) {
			reset({ values, recaptcha: recaptchaValue })
		} else {
			toast.error(t('errors.completeRecaptcha'))
		}
	}

	return (
		<AuthWrapper
			heading={t('heading')}
			description={t('description')}
			backButtonLabel={t('backButtonLabel')}
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('email.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('email.placeholder')}
										disabled={isLoadingReset}
										type='email'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-center'>
						<ReCAPTCHA
							sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
							onChange={setRecaptchaValue}
						/>
					</div>
					<Button type='submit' disabled={isLoadingReset}>
						{t('submit')}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
