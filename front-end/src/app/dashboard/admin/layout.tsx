import { AdminSidebar } from '@widgets/admin-sidebar/AdminSidebar'

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
