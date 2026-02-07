import { Skeleton } from '@shared/ui'

export function OrderDetailsSkeleton() {
	return (
		<div className='min-h-screen px-4 py-8'>
			<div className='mx-auto max-w-5xl'>
				<div className='mb-8 overflow-hidden rounded-2xl bg-white shadow-lg'>
					<div className='bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-8'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-4'>
								<Skeleton className='h-16 w-16 rounded-2xl' />
								<div className='space-y-2'>
									<Skeleton className='h-8 w-48' />
									<Skeleton className='h-5 w-32' />
								</div>
							</div>
							<Skeleton className='h-7 w-24 rounded-full' />
						</div>
					</div>

					<div className='bg-white px-6 py-6'>
						<div className='flex items-center justify-between'>
							<div className='flex flex-1 flex-col items-center'>
								<Skeleton className='mb-2 h-10 w-10 rounded-full' />
								<Skeleton className='h-3 w-16' />
							</div>
							<Skeleton className='h-1 flex-1' />
							<div className='flex flex-1 flex-col items-center'>
								<Skeleton className='mb-2 h-10 w-10 rounded-full' />
								<Skeleton className='h-3 w-16' />
							</div>
							<Skeleton className='h-1 flex-1' />
							<div className='flex flex-1 flex-col items-center'>
								<Skeleton className='mb-2 h-10 w-10 rounded-full' />
								<Skeleton className='h-3 w-16' />
							</div>
							<Skeleton className='h-1 flex-1' />
							<div className='flex flex-1 flex-col items-center'>
								<Skeleton className='mb-2 h-10 w-10 rounded-full' />
								<Skeleton className='h-3 w-20' />
							</div>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
					<div className='space-y-6 lg:col-span-2'>
						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4'>
								<Skeleton className='h-6 w-56' />
							</div>
							<div className='divide-y divide-gray-100 p-4'>
								{[1, 2, 3].map(i => (
									<div key={i} className='flex items-center gap-4 py-4'>
										<Skeleton className='h-20 w-20 rounded-xl' />
										<div className='flex-1 space-y-2'>
											<Skeleton className='h-5 w-full' />
											<Skeleton className='h-4 w-32' />
										</div>
										<Skeleton className='h-6 w-16' />
									</div>
								))}
							</div>
							<div className='border-t px-6 py-4'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-5 w-32' />
									<Skeleton className='h-8 w-24' />
								</div>
							</div>
						</div>

						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4'>
								<Skeleton className='h-6 w-60' />
							</div>
							<div className='space-y-4 p-6'>
								{[1, 2, 3, 4].map(i => (
									<div key={i} className='flex items-start gap-3'>
										<Skeleton className='h-9 w-9 rounded-lg' />
										<div className='flex-1 space-y-2'>
											<Skeleton className='h-3 w-24' />
											<Skeleton className='h-5 w-full' />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className='space-y-6'>
						<div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
							<div className='border-b bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3'>
								<Skeleton className='h-4 w-24' />
							</div>
							<div className='space-y-4 p-4'>
								<div className='space-y-2'>
									<Skeleton className='h-3 w-28' />
									<Skeleton className='h-5 w-full' />
									<Skeleton className='h-3 w-20' />
								</div>
								<div className='space-y-2 border-t pt-3'>
									<Skeleton className='h-3 w-32' />
									<Skeleton className='h-5 w-full' />
									<Skeleton className='h-3 w-20' />
								</div>
								<div className='space-y-2 border-t pt-3'>
									<Skeleton className='h-3 w-28' />
									<Skeleton className='h-8 w-16' />
								</div>
							</div>
						</div>

						<div className='overflow-hidden rounded-2xl bg-blue-50 shadow-sm'>
							<div className='p-4'>
								<Skeleton className='mb-2 h-5 w-32' />
								<Skeleton className='mb-3 h-10 w-full' />
								<Skeleton className='h-10 w-full rounded-lg' />
							</div>
						</div>
					</div>
				</div>

				<div className='mt-8 flex justify-center gap-4'>
					<Skeleton className='h-12 w-36 rounded-full' />
					<Skeleton className='h-12 w-40 rounded-full' />
				</div>
			</div>
		</div>
	)
}
