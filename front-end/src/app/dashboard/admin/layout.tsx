import { AdminSidebar } from '@widgets/admin-sidebar'

export default function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<div className='flex'>
				<AdminSidebar />
			</div>
			<main>{children}</main>
		</>
	)
}
