'use client'

import { type ChartDataPoint } from '@entities/api/analyticsApi'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

interface StatsChartProps {
	data: ChartDataPoint[]
}

export function StatsChart({ data }: StatsChartProps) {
	return (
		<div className='rounded-lg border bg-white p-6 shadow-sm'>
			<h3 className='mb-4 text-lg font-semibold text-gray-900'>
				Динамика за период
			</h3>
			<ResponsiveContainer width='100%' height={400}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
							<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
						</linearGradient>
						<linearGradient id='colorOrders' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
							<stop offset='95%' stopColor='#10b981' stopOpacity={0} />
						</linearGradient>
						<linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='#f59e0b' stopOpacity={0.8} />
							<stop offset='95%' stopColor='#f59e0b' stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
					<XAxis
						dataKey='date'
						stroke='#6b7280'
						fontSize={12}
						tickFormatter={value => {
							const date = new Date(value)
							return `${date.getDate()}.${date.getMonth() + 1}`
						}}
					/>
					<YAxis stroke='#6b7280' fontSize={12} />
					<Tooltip
						contentStyle={{
							backgroundColor: 'white',
							border: '1px solid #e5e7eb',
							borderRadius: '8px'
						}}
						labelFormatter={value => {
							const date = new Date(value as string)
							return date.toLocaleDateString('ru-RU')
						}}
					/>
					<Legend />
					<Area
						type='monotone'
						dataKey='views'
						name='Просмотры'
						stroke='#3b82f6'
						strokeWidth={2}
						fillOpacity={1}
						fill='url(#colorViews)'
					/>
					<Area
						type='monotone'
						dataKey='orders'
						name='Заказы'
						stroke='#10b981'
						strokeWidth={2}
						fillOpacity={1}
						fill='url(#colorOrders)'
					/>
					<Area
						type='monotone'
						dataKey='revenue'
						name='Выручка ($)'
						stroke='#f59e0b'
						strokeWidth={2}
						fillOpacity={1}
						fill='url(#colorRevenue)'
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
