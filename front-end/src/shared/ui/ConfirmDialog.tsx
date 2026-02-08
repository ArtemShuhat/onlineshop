'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from './Button'
import { Dialog, DialogContent, DialogTitle } from './primitives/dialog'

interface ConfirmDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	description?: string
	confirmText?: string
	cancelText?: string
	variant?: 'danger' | 'warning' | 'info'
	children?: React.ReactNode
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title = 'Подтверждение действия',
	description = 'Вы уверены, что хотите выполнить это действие?',
	confirmText = 'Удалить',
	cancelText = 'Отмена',
	variant = 'danger',
	children
}: ConfirmDialogProps) {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	const variantStyles = {
		danger: {
			bg: 'from-red-700 to-orange-600',
			icon: 'text-red-600',
			button: 'bg-red-600 hover:bg-red-800'
		},
		warning: {
			bg: 'from-yellow-700 to-orange-700',
			icon: 'text-yellow-600',
			button: 'bg-yellow-700 hover:bg-yellow-800'
		},
		info: {
			bg: 'from-blue-500 to-purple-500',
			icon: 'text-blue-600',
			button: 'bg-blue-600 hover:bg-blue-700'
		}
	}

	const style = variantStyles[variant]

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl'>
				<DialogTitle className='sr-only'>{title}</DialogTitle>
				<div
					className={`relative overflow-hidden bg-gradient-to-br ${style.bg} px-6 py-8`}
				>
					<div className='relative'>
						<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md'>
							<AlertTriangle className='h-8 w-8 text-white' />
						</div>
						<h2 className='text-2xl font-bold text-white'>{title}</h2>
					</div>
				</div>

				<div className='p-6'>
					<p className='text-gray-700'>{description}</p>
					<div className='mt-6 flex gap-3'>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
							className='flex-1'
						>
							{cancelText}
						</Button>
						<Button
							type='button'
							onClick={handleConfirm}
							className={`flex-1 text-white ${style.button}`}
						>
							{confirmText}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
