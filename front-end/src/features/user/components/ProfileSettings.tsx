'use client';

import { CURRENCY_CONFIG, Currency, useCurrencyStore } from '@entities/currency';
import { AuthMethod } from '@entities/user';
import { useProfile } from '@entities/user';
import { SettingsSchema, TypeSettingsSchema, useUpdateProfileMutation } from '@features/user';
import { useLogoutMutation } from '@features/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Loading, Switch } from '@shared/ui';
import { AlertCircle, CheckCircle2, Globe, LogOut, Palette, Shield, ShoppingBag, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';





type Tab = 'profile' | 'security' | 'preferences'
const LANGUAGE_SWITCH_TOAST_KEY = 'profile_settings_language_switch_toast'

const LANGUAGES = [
	{ code: 'ru', labelKey: 'languages.ru' },
	{ code: 'uk', labelKey: 'languages.uk' },
	{ code: 'en', labelKey: 'languages.en' }
] as const

export function ProfileSettings() {
	const t = useTranslations('profileSettings')
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const { user, isLoading } = useProfile()
	const [activeTab, setActiveTab] = useState<Tab>('profile')
	const { currency, setCurrency } = useCurrencyStore()
	const { logout } = useLogoutMutation()

	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(SettingsSchema),
		values: {
			name: user?.displayName || '',
			email: user?.email || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false
		}
	})

	const { update, isLoadingUpdate } = useUpdateProfileMutation()

	const onSubmit = (values: TypeSettingsSchema) => {
		update(values)
	}

	useEffect(() => {
		const shouldShowToast = sessionStorage.getItem(LANGUAGE_SWITCH_TOAST_KEY)
		if (!shouldShowToast) return

		sessionStorage.removeItem(LANGUAGE_SWITCH_TOAST_KEY)
		toast.success(t('preferences.changeSuccess'))
	}, [locale, t])

	const handleLanguageSwitch = (
		newLocale: (typeof LANGUAGES)[number]['code']
	) => {
		if (newLocale === locale) return

		sessionStorage.setItem(LANGUAGE_SWITCH_TOAST_KEY, '1')
		const segments = pathname.split('/')
		segments[1] = newLocale
		router.push(segments.join('/'))
	}

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loading />
			</div>
		)
	}

	if (!user) return null

	const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
		{
			id: 'profile',
			label: t('tabs.profile'),
			icon: <User className='h-4 w-4' />
		},
		{
			id: 'security',
			label: t('tabs.security'),
			icon: <Shield className='h-4 w-4' />
		},
		{
			id: 'preferences',
			label: t('tabs.preferences'),
			icon: <Palette className='h-4 w-4' />
		}
	]

	return (
		<div className='mx-auto mt-16 min-h-[750px] min-w-[900px] space-y-6 px-4'>
			<div className='overflow-hidden rounded-2xl bg-gradient-to-br from-pur via-purple-600 to-purple-800 p-6 text-white shadow-lg'>
				<div className='flex items-center gap-5'>
					<div className='relative'>
						{user.picture ? (
							<Image
								src={user.picture}
								alt={user.displayName}
								width={80}
								height={80}
								className='rounded-2xl object-cover shadow-lg'
							/>
						) : (
							<div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-sm'>
								{user.displayName?.charAt(0)?.toUpperCase() || 'U'}
							</div>
						)}
						{user.isVerified && (
							<div className='absolute -bottom-1 -right-1 rounded-full bg-green-400 p-1 shadow'>
								<CheckCircle2 className='h-3 w-3 text-white' />
							</div>
						)}
					</div>

					<div className='flex-1'>
						<h1 className='text-2xl font-bold'>{user.displayName}</h1>
						<p className='mt-0.5 text-sm text-white/80'>{user.email}</p>
						<div className='mt-2 flex flex-wrap gap-2'>
							{user.isVerified && (
								<span className='inline-flex items-center gap-1 rounded-full bg-green-400/20 px-2.5 py-0.5 text-xs font-medium text-green-200'>
									<CheckCircle2 className='h-3 w-3' />
									{t('badges.emailVerified')}
								</span>
							)}
							{user.isTwoFactorEnabled && (
								<span className='inline-flex items-center gap-1 rounded-full bg-blue-400/20 px-2.5 py-0.5 text-xs font-medium text-blue-200'>
									<Shield className='h-3 w-3' />
									{t('badges.twoFaEnabled')}
								</span>
							)}
							<span className='inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium'>
								{user.method === AuthMethod.GOOGLE
									? t('badges.authGoogle')
									: t('badges.authEmail')}
							</span>
						</div>
					</div>

					<button
						onClick={() => logout()}
						className='flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20'
					>
						<LogOut className='h-4 w-4' />
						{t('logout')}
					</button>
				</div>
			</div>

			<div className='flex gap-1 rounded-xl bg-gray-100 p-1'>
				{tabs.map(tab => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
							activeTab === tab.id
								? 'bg-white text-gray-900 shadow-sm'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						{tab.icon}
						<span className='max-sm:hidden'>{tab.label}</span>
					</button>
				))}

				<Link
					href='/orders'
					className='flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:text-gray-900'
				>
					<ShoppingBag className='h-4 w-4' />
					<span className='max-sm:hidden'>{t('orders')}</span>
				</Link>
			</div>

			{activeTab === 'profile' && (
				<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
					<div className='border-b bg-gray-50 px-6 py-4'>
						<h2 className='flex items-center gap-2 font-semibold text-gray-900'>
							<User className='h-5 w-5 text-pur' />
							{t('profile.personalData')}
						</h2>
					</div>
					<div className='p-6'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-5'
							>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('profile.name')}</FormLabel>
											<FormControl>
												<Input
													placeholder={t('profile.namePlaceholder')}
													disabled={isLoadingUpdate}
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder={t('profile.emailPlaceholder')}
													type='email'
													disabled={isLoadingUpdate}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type='submit'
									disabled={isLoadingUpdate}
									className='w-full bg-pur hover:bg-purh'
								>
									{isLoadingUpdate
										? t('profile.saving')
										: t('profile.saveChanges')}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			)}
			{activeTab === 'security' && (
				<div className='space-y-4'>
					{user.method === AuthMethod.GOOGLE && (
						<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
							<div className='border-b bg-gray-50 px-6 py-4'>
								<h2 className='flex items-center gap-2 font-semibold text-gray-900'>
									<Shield className='h-5 w-5 text-pur' />
									{t('security.title')}
								</h2>
							</div>
							<div className='p-6'>
								<div className='rounded-xl border border-amber-100 bg-amber-50 p-4'>
									<div className='flex items-start gap-3'>
										<AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600' />
										<div>
											<p className='font-medium text-amber-900'>
												{t('security.googleAccountTitle')}
											</p>
											<p className='mt-1 text-sm text-amber-700'>
												{t('security.googleAccountDescription')}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
					<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
						<div className='border-b bg-gray-50 px-6 py-4'>
							<h2 className='flex items-center gap-2 font-semibold text-gray-900'>
								<Shield className='h-5 w-5 text-pur' />
								{t('security.twoFaTitle')}
							</h2>
						</div>
						<div className='p-6'>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-4'
								>
									<FormField
										control={form.control}
										name='isTwoFactorEnabled'
										render={({ field }) => (
											<FormItem className='flex items-center justify-between rounded-xl border bg-gray-50 p-4'>
												<div className='space-y-0.5'>
													<FormLabel className='text-base'>
														{t('profile.twoFaTitle')}
													</FormLabel>
													<FormDescription>
														{t('profile.twoFaDescription')}
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										disabled={isLoadingUpdate}
										className='bg-pur hover:bg-purh'
									>
										{isLoadingUpdate
											? t('profile.saving')
											: t('profile.saveChanges')}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			)}
			{activeTab === 'preferences' && (
				<div className='space-y-4'>
					<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
						<div className='border-b bg-gray-50 px-6 py-4'>
							<h2 className='flex items-center gap-2 font-semibold text-gray-900'>
								<Globe className='h-5 w-5 text-pur' />
								{t('preferences.currencyTitle')}
							</h2>
						</div>
						<div className='p-6'>
							<p className='mb-4 text-sm text-gray-500'>
								{t('preferences.currencyDescription')}
							</p>
							<div className='grid gap-3 sm:grid-cols-3'>
								{(
									Object.entries(CURRENCY_CONFIG) as [
										Currency,
										(typeof CURRENCY_CONFIG)[Currency]
									][]
								).map(([code, config]) => (
									<button
										key={code}
										onClick={() => setCurrency(code)}
										className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
											currency === code
												? 'border-pur bg-purple-50'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<div>
											<p className='font-semibold text-gray-900'>{code}</p>
											<p className='text-xs text-gray-500'>
												{config.symbol} · {t(config.labelKey)}
											</p>
										</div>
										{currency === code && (
											<CheckCircle2 className='ml-auto h-5 w-5 text-pur' />
										)}
									</button>
								))}
							</div>
						</div>
					</div>
					<div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
						<div className='border-b bg-gray-50 px-6 py-4'>
							<h2 className='flex items-center gap-2 font-semibold text-gray-900'>
								<Globe className='h-5 w-5 text-pur' />
								{t('preferences.languageTitle')}
							</h2>
						</div>
						<div className='p-6'>
							<p className='mb-4 text-sm text-gray-500'>
								{t('preferences.languageDescription')}
							</p>
							<div className='grid gap-3 sm:grid-cols-3'>
								{LANGUAGES.map(lang => (
									<button
										key={lang.code}
										onClick={() => handleLanguageSwitch(lang.code)}
										className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
											locale === lang.code
												? 'border-pur bg-purple-50'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<div>
											<p className='font-semibold text-gray-900'>
												{t(lang.labelKey)}
											</p>
										</div>
										{locale === lang.code && (
											<CheckCircle2 className='ml-auto h-5 w-5 text-pur' />
										)}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
