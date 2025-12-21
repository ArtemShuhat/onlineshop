import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
// Добавьте этот импорт
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { authService } from '../api'
import { TypeRegisterSchema } from '../schemes'

export function useRegisterMutation() {
	const router = useRouter()

	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeRegisterSchema
			recaptcha: string
		}) => authService.register(values, recaptcha),
		onSuccess(data: any) {
			toastMessageHandler(data)
			toast.success('Регистрация успешна')
			router.push('/')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
