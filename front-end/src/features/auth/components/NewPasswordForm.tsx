'use client'

import { NewPasswordSchema, TypeNewPasswordSchema } from '@features/auth'
import { AuthWrapper } from '@features/auth'
import { useNewPasswordMutation } from '@features/auth'
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
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'sonner'

export function NewPasswordForm() {
	const t = useTranslations('newPasswordForm')
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm<TypeNewPasswordSchema>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const { newPassword, isLoadingNew } = useNewPasswordMutation()

	const onSubmit = (values: TypeNewPasswordSchema) => {
		if (recaptchaValue) {
			newPassword({ values, recaptcha: recaptchaValue })
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
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('password.label')}</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder={t('password.placeholder')}
											disabled={isLoadingNew}
											type={showPassword ? 'text' : 'password'}
											{...field}
										/>
										<button
											type='button'
											onClick={() => setShowPassword(prev => !prev)}
											className='absolute right-2 top-1/2 -translate-y-1/2 transform'
										>
											{showPassword ? <FaEyeSlash /> : <FaEye />}
										</button>
									</div>
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
					<Button type='submit' disabled={isLoadingNew}>
						{t('submit')}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
