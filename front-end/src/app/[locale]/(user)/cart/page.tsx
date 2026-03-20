'use client'

import { useCart } from '@entities/cart'
import { useProfile } from '@entities/user'
import { CartCheckoutContent } from '@features/cart-checkout'
import {
	CheckoutStepper,
	ConfirmationStep,
	ShippingStep,
	useCheckoutStore
} from '@processes/checkout'
import { Button } from '@shared/ui/Button'
import { SimilarProducts } from '@widgets/similar-products'
import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const stepMap: { [key: string]: number } = {
	cart: 1,
	'shipping-details': 2,
	confirmation: 3
}

function CartPageContent() {
	const t = useTranslations('cartPage')
	const { user } = useProfile()
	const { items, isLoading } = useCart()
	const router = useRouter()
	const { currentStep, setCurrentStep } = useCheckoutStore()
	const searchParams = useSearchParams()

	const stepParam = searchParams.get('step')

	useEffect(() => {
		if (stepParam && stepMap[stepParam]) {
			setCurrentStep(stepMap[stepParam])
		} else {
			setCurrentStep(1)
		}
	}, [stepParam, setCurrentStep])

	const handleNextStep = () => {
		if (!user) {
			router.push('/auth/login')
			return
		}

		router.push('/cart?step=shipping-details')
	}

	if (isLoading) {
		return <div>{t('loading')}</div>
	}

	return (
		<>
			<div className='container mx-auto min-h-[600px] max-w-5xl px-4 py-8 max-xs:py-0 max-sm:py-0 max-md:py-0'>
				<CheckoutStepper currentStep={currentStep} />

				<div className='mt-8 max-md:px-4 max-xs:!px-0 max-sm:px-3'>
					{currentStep === 1 && (
						<CartCheckoutContent
							emptyState={
								<div className='py-16 text-center'>
									<ShoppingBag className='mx-auto h-24 w-24 text-gray-300' />
									<h2 className='mt-4 text-xl font-semibold text-gray-700'>
										{t('emptyTitle')}
									</h2>
									<p className='mt-2 text-gray-500'>{t('emptySubtitle')}</p>
									<Link href='/'>
										<Button className='mt-6'>{t('goShopping')}</Button>
									</Link>
								</div>
							}
							footer={
								items.length > 0 ? (
									<div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
										<Link href='/'>
											<Button variant='outline' className='w-full sm:w-auto'>
												{t('continueShopping')}
											</Button>
										</Link>

										<Button
											className='w-full text-base font-semibold sm:w-auto'
											size='lg'
											onClick={handleNextStep}
										>
											{t('checkout')}
										</Button>
									</div>
								) : null
							}
						/>
					)}

					{currentStep === 2 && <ShippingStep />}
					{currentStep === 3 && <ConfirmationStep />}
				</div>

				{items.length > 0 && (
					<SimilarProducts
						productId={items[0].productId}
						excludeIds={items.map(item => item.productId)}
					/>
				)}
			</div>
		</>
	)
}

export default function CartPage() {
	const t = useTranslations('cartPage')

	return (
		<Suspense fallback={<div>{t('loading')}</div>}>
			<CartPageContent />
		</Suspense>
	)
}
