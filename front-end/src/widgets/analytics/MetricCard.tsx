import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
	title: string
	value: string | number
	icon: LucideIcon
	description?: string
	color?: 'blue' | 'green' | 'orange' | 'purple'
}

const colorClasses = {
	blue: {
		bg: 'bg-blue-50',
		icon: 'text-blue-600',
		border: 'border-blue-100'
	},
	green: {
		bg: 'bg-green-50',
		icon: 'text-green-600',
		border: 'border-green-100'
	},
	orange: {
		bg: 'bg-orange-50',
		icon: 'text-orange-600',
		border: 'border-orange-100'
	},
	purple: {
		bg: 'bg-purple-50',
		icon: 'text-purple-600',
		border: 'border-purple-100'
	}
}

export function MetricCard({
	title,
	value,
	icon: Icon,
	description,
	color = 'blue'
}: MetricCardProps) {
	const colors = colorClasses[color]

	return (
		<div className='group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md'>
			<div className='flex items-start justify-between'>
				<div className='flex-1'>
					<p className='text-sm font-medium text-gray-600'>{title}</p>
					<p className='mt-2 text-3xl font-bold text-gray-900'>{value}</p>
					{description && (
						<p className='mt-2 text-sm text-gray-500'>{description}</p>
					)}
				</div>
				<div className={`rounded-lg ${colors.bg} p-3`}>
					<Icon className={`h-6 w-6 ${colors.icon}`} />
				</div>
			</div>
		</div>
	)
}
