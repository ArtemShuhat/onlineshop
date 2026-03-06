'use client'

import { useEffect, useRef } from 'react'

export function useBodyScrollLock(locked: boolean) {
	const lockedScrollY = useRef(0)
	const styleSnapshot = useRef({
		overflow: '',
		position: '',
		top: '',
		width: ''
	})

	useEffect(() => {
		if (typeof window === 'undefined' || !locked) return

		const body = document.body
		lockedScrollY.current = window.scrollY
		styleSnapshot.current = {
			overflow: body.style.overflow,
			position: body.style.position,
			top: body.style.top,
			width: body.style.width
		}

		body.style.overflow = 'hidden'
		body.style.position = 'fixed'
		body.style.top = `-${lockedScrollY.current}px`
		body.style.width = '100%'

		return () => {
			const snap = styleSnapshot.current
			body.style.overflow = snap.overflow
			body.style.position = snap.position
			body.style.top = snap.top
			body.style.width = snap.width
			window.scrollTo({ top: lockedScrollY.current })
		}
	}, [locked])
}

