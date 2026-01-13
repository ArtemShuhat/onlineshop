'use client'

import { TanstackQueryProvider } from '@shared/providers'
import { ToastProvider } from '@shared/providers'
import { type PropsWithChildren } from 'react'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ToastProvider />
			{children}
		</TanstackQueryProvider>
	)
}
