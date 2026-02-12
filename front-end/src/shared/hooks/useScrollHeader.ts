'use client'

import { useEffect, useState } from 'react'

interface UseScrollHeaderOptions {
	initialOffset?: number
	scrollDistance?: number
	respectMotionPreference?: boolean
}

interface UseScrollHeaderReturn {
	translateY: number
	progress: number
	prefersReducedMotion: boolean
}

export function useScrollHeader({
	initialOffset = 16,
	scrollDistance = 80,
	respectMotionPreference = true
}: UseScrollHeaderOptions = {}): UseScrollHeaderReturn {
	const [translateY, setTranslateY] = useState(initialOffset)
	const [progress, setProgress] = useState(0)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		if (respectMotionPreference) {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
			setPrefersReducedMotion(mediaQuery.matches)

			const handleChange = (e: MediaQueryListEvent) => {
				setPrefersReducedMotion(e.matches)
			}

			mediaQuery.addEventListener('change', handleChange)
			return () => mediaQuery.removeEventListener('change', handleChange)
		}
	}, [respectMotionPreference])

	useEffect(() => {
		if (prefersReducedMotion) {
			setTranslateY(0)
			setProgress(1)
			return
		}

		let ticking = false

		const updateTransform = () => {
			const scrollY = window.scrollY

			const currentProgress = Math.min(scrollY / scrollDistance, 1)

			const newTranslateY = initialOffset * (1 - currentProgress)

			setProgress(currentProgress)
			setTranslateY(newTranslateY)
			ticking = false
		}

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateTransform)
				ticking = true
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })

		updateTransform()

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [initialOffset, scrollDistance, prefersReducedMotion])

	return {
		translateY,
		progress,
		prefersReducedMotion
	}
}
