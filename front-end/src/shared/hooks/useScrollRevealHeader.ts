'use client'

import { useEffect, useState } from 'react'

interface UseScrollRevealHeaderOptions {
	hiddenOffset?: number
	revealThreshold?: number
	respectMotionPreference?: boolean
}

interface UseScrollRevealHeaderReturn {
	translate: number
	progress: number
	isRevealed: boolean
	prefersReducedMotion: boolean
}

export function useScrollRevealHeader({
	hiddenOffset = -100,
	revealThreshold = 120,
	respectMotionPreference = true
}: UseScrollRevealHeaderOptions = {}): UseScrollRevealHeaderReturn {
	const [translate, setTranslate] = useState(hiddenOffset)
	const [progress, setProgress] = useState(0)
	const [isRevealed, setIsRevealed] = useState(false)
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
			setTranslate(0)
			setProgress(1)
			setIsRevealed(true)
			return
		}

		let ticking = false

		const updateTransform = () => {
			const scrollY = window.scrollY

			if (scrollY < revealThreshold) {
				const currentProgress = scrollY / revealThreshold
				const newtranslate =
					hiddenOffset + Math.abs(hiddenOffset) * currentProgress

				setProgress(currentProgress)
				setTranslate(newtranslate)
				setIsRevealed(false)
			} else {
				setProgress(1)
				setTranslate(0)
				setIsRevealed(true)
			}

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
	}, [hiddenOffset, revealThreshold, prefersReducedMotion])

	return {
		translate,
		progress,
		isRevealed,
		prefersReducedMotion
	}
}
