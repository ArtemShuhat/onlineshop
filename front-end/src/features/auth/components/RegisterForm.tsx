'use client'

import { useRegisterMutation } from '@features/auth'
import { RegisterSchema, TypeRegisterSchema } from '@features/auth'
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
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'sonner'

export function RegisterForm() {
	const t = useTranslations('registerForm')
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const [showPassword, setShowPassword] = useState(false)
	const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)

	const { register, isLoadingRegister } = useRegisterMutation()

	const onSubmit = (values: TypeRegisterSchema) => {
		if (recaptchaValue) {
			register({ values, recaptcha: recaptchaValue })
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
			isShowSocial
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('fields.name.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('fields.name.placeholder')}
										disabled={isLoadingRegister}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('fields.email.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('fields.email.placeholder')}
										disabled={isLoadingRegister}
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
								<FormLabel>{t('fields.password.label')}</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder={t('fields.password.placeholder')}
											disabled={isLoadingRegister}
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
					<FormField
						control={form.control}
						name='passwordRepeat'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('fields.passwordRepeat.label')}</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder={t('fields.passwordRepeat.placeholder')}
											disabled={isLoadingRegister}
											type={showPasswordRepeat ? 'text' : 'password'}
											{...field}
										/>
										<button
											type='button'
											onClick={() => setShowPasswordRepeat(prev => !prev)}
											className='absolute right-2 top-1/2 -translate-y-1/2 transform'
										>
											{showPasswordRepeat ? <FaEyeSlash /> : <FaEye />}
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
					<Button type='submit' disabled={isLoadingRegister}>
						{t('submit')}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
