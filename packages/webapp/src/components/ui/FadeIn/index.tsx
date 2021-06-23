/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import { Transition } from 'react-transition-group'
import { memo } from 'react'

interface FadeInProps extends ComponentProps {
	in?: boolean
}

const duration = 300

const defaultStyle = {
	transition: `opacity ${duration}ms ease-in-out`,
	opacity: 0
}

const transitionStyles = {
	entering: { opacity: 0, display: 'block' },
	entered: { opacity: 1, display: 'block' },
	exiting: { opacity: 0, display: 'block' },
	exited: { opacity: 0, display: 'none' }
}

const FadeIn = memo(function FadeIn({ in: inProp, children, className }: FadeInProps): JSX.Element {
	return (
		<Transition in={inProp} timeout={duration}>
			{state => (
				<div
					style={{
						marginTop: '1rem', // this component doesn't support classNames :(
						...defaultStyle,
						...transitionStyles[state]
					}}
				>
					{children}
				</div>
			)}
		</Transition>
	)
})
export default FadeIn