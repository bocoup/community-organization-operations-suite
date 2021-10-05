/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { Transition } from 'react-transition-group'
import { memo } from 'react'

interface FadeInProps {
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

export const FadeIn: StandardFC<FadeInProps> = memo(function FadeIn({ in: inProp, children }) {
	return (
		<Transition in={inProp} timeout={duration}>
			{(state) => (
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
