import { AdminSidebar } from '@widgets/admin-sidebar'

export default function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<AdminSidebar />
			<div className='container mx-auto p-6'>{children}</div>
		</>
	)
}
