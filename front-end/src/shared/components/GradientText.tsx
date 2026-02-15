'use client'

import React, { ReactNode } from 'react'

interface GradientTextProps {
	children: ReactNode
	className?: string
	colors?: string[]
	animationSpeed?: number
	showBorder?: boolean
}

export default function GradientText({
	children,
	className = '',
	colors = ['#ffaa40', '#9c40ff', '#ffaa40'],
	animationSpeed = 8,
	showBorder = false
}: GradientTextProps) {
	const gradientStyle = {
		backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
		animationDuration: `${animationSpeed}s`
	}

	return (
		<span
			className={`relative inline-flex cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 ${className}`}
		>
			{showBorder && (
				<span
					className='pointer-events-none absolute inset-0 z-0 animate-gradient bg-cover'
					style={{
						...gradientStyle,
						backgroundSize: '300% 100%'
					}}
				>
					<span
						className='absolute inset-0 z-[-1] rounded-[1.25rem] bg-black'
						style={{
							width: 'calc(100% - 2px)',
							height: 'calc(100% - 2px)',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)'
						}}
					></span>
				</span>
			)}
			<span
				className='z-2 relative inline-block animate-gradient bg-cover text-transparent'
				style={{
					...gradientStyle,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					backgroundSize: '300% 100%'
				}}
			>
				{children}
			</span>
		</span>
	)
}
