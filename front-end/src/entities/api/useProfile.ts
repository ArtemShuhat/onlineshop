import { useQuery } from '@tanstack/react-query'

import { userService } from '@/features/user/services'

export function useProfile() {
	const {
		data: user,
		isLoading,
		error
	} = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.findProfile(),
		retry: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false
	})

	return {
		user: error ? null : user,
		isLoading
	}
}
