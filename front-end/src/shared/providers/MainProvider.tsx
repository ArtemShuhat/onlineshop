'use client'

import { type PropsWithChildren } from 'react'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ToastProvider } from './ToastProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ToastProvider />
			{children}
		</TanstackQueryProvider>
	)
}
