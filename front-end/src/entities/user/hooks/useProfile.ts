import { userService } from '@features/user'
import { useQuery } from '@tanstack/react-query'

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
