import { debounce } from 'lodash'
import React from 'react'
import WindowSize from '~types/WindowSize'
/**
 * Borrowed from bootstrap https://getbootstrap.com/docs/5.0/layout/breakpoints/
 */
// Constants left in this hook to avoid use outside of this file
const breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400
}

/**
 * Constant for server side render
 */
const ssrWindow: WindowSize = {
	width: 576,
	height: 576 * (16 / 9),
	isSM: true,
	isMD: false,
	isLG: false,
	isXL: false,
	isXXL: false,
	isLessThanSM: false,
	isLessThanMD: true,
	isLessThanLG: true,
	isLessThanXL: true,
	isLessThanXXL: true
}

/**
 *	getter function to return windowSize
 * @returns {WindowSize} windowSize
 */
const getWindowSize = (): WindowSize => {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		isSM: window.innerWidth > breakpoints.sm,
		isMD: window.innerWidth > breakpoints.md,
		isLG: window.innerWidth > breakpoints.lg,
		isXL: window.innerWidth > breakpoints.xl,
		isXXL: window.innerWidth > breakpoints.xxl,
		isLessThanSM: window.innerWidth < breakpoints.sm,
		isLessThanMD: window.innerWidth < breakpoints.md,
		isLessThanLG: window.innerWidth < breakpoints.lg,
		isLessThanXL: window.innerWidth < breakpoints.xl,
		isLessThanXXL: window.innerWidth < breakpoints.xxl
	}
}

/**
 * Hook for responsive rendering inside of JSX elements
 * @returns {WindowSize} WindowSize with width, height, and breakpoints
 */
export default function useWindowSize(): WindowSize {
	const isSSR = typeof window !== 'undefined'
	const [windowSize, setWindowSize] = React.useState(isSSR ? ssrWindow : getWindowSize())

	function changeWindowSize() {
		setWindowSize(getWindowSize())
	}

	React.useEffect(() => {
		// Call once on first render
		changeWindowSize()

		// TODO: pull in correct type from lodash
		/* eslint-disable @typescript-eslint/no-unsafe-call */
		const debouncedChangeWindowSize = debounce(changeWindowSize, 1000 / 60) // throttle to 60 fps

		// Add event listener
		window.addEventListener('resize', debouncedChangeWindowSize)

		return () => {
			// Remove event listener
			window.removeEventListener('resize', debouncedChangeWindowSize)
		}
	}, [])

	return windowSize
}
