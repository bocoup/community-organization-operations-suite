/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { useCallback, useState } from 'react'
import Confetti from 'react-dom-confetti'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

const confettiConfig = {
	angle: 90,
	spread: 360,
	startVelocity: 40,
	elementCount: 70,
	dragFriction: 0.12,
	duration: 3000,
	stagger: 3,
	width: '8px',
	height: '8px',
	perspective: '500px',
	colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

interface HappySubmitButtonProps extends ComponentProps {
	title?: string
	text?: string
	options?: Record<string, any>
}

export default function HappySubmitButton({
	options,
	children,
	text,
	className
}: HappySubmitButtonProps): JSX.Element {
	const [active, setActive] = useState(false)
	const config = {
		...confettiConfig,
		...options
	}

	const handleClick = useCallback(() => {
		if (!active) {
			setActive(true)

			setTimeout(() => {
				setActive(false)
			}, 1000)
		}
	}, [active])

	return (
		<PrimaryButton className={className} text={text} onClick={handleClick}>
			<Confetti active={active} config={config} className={styles.confetti} />

			{children}
		</PrimaryButton>
	)
}
