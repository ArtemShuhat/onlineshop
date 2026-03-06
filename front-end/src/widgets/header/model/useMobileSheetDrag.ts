'use client'

import { type PointerEvent, useEffect, useRef } from 'react'

const SHEET_CLOSE_DRAG_THRESHOLD = 90

interface UseMobileSheetDragOptions {
	isOpen: boolean
	onClose: () => void
}

export function useMobileSheetDrag({
	isOpen,
	onClose
}: UseMobileSheetDragOptions) {
	const sheetRef = useRef<HTMLElement | null>(null)
	const dragStartY = useRef<number | null>(null)
	const dragDistance = useRef(0)
	const rafRef = useRef<number | null>(null)
	const activePointerId = useRef<number | null>(null)

	const cancelRaf = () => {
		if (rafRef.current === null) return
		cancelAnimationFrame(rafRef.current)
		rafRef.current = null
	}

	const clearInlineStyles = () => {
		const sheet = sheetRef.current
		if (!sheet) return
		sheet.style.transition = ''
		sheet.style.transform = ''
	}

	const animateTo = (transformValue: string) => {
		const sheet = sheetRef.current
		if (!sheet) return
		sheet.style.transition = 'transform 220ms ease-out'
		sheet.style.transform = transformValue
		sheet.addEventListener('transitionend', clearInlineStyles, { once: true })
	}

	const scheduleDragRender = () => {
		if (rafRef.current !== null) return
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null
			const sheet = sheetRef.current
			if (!sheet) return
			sheet.style.transition = 'none'
			sheet.style.transform = `translate3d(0, ${dragDistance.current}px, 0)`
		})
	}

	useEffect(() => {
		if (!isOpen) {
			dragStartY.current = null
			dragDistance.current = 0
		}
		activePointerId.current = null
		cancelRaf()
		clearInlineStyles()
	}, [isOpen])

	useEffect(() => () => cancelRaf(), [])

	const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
		dragStartY.current = event.clientY
		dragDistance.current = 0
		activePointerId.current = event.pointerId
		event.currentTarget.setPointerCapture(event.pointerId)
	}

	const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
		if (
			dragStartY.current === null ||
			activePointerId.current !== event.pointerId
		)
			return

		dragDistance.current = Math.max(0, event.clientY - dragStartY.current)
		scheduleDragRender()
	}

	const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
		if (activePointerId.current !== event.pointerId) return

		if (dragStartY.current === null) {
			activePointerId.current = null
			return
		}

		if (dragDistance.current > SHEET_CLOSE_DRAG_THRESHOLD) {
			animateTo('translate3d(0, 100%, 0)')
			onClose()
		} else {
			animateTo('translate3d(0, 0, 0)')
		}

		dragDistance.current = 0
		dragStartY.current = null
		activePointerId.current = null
	}

	return {
		sheetRef,
		dragHandlers: {
			onPointerDown: handleDragStart,
			onPointerMove: handleDragMove,
			onPointerUp: handleDragEnd,
			onPointerCancel: handleDragEnd,
			onLostPointerCapture: handleDragEnd
		}
	}
}
