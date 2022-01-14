/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IIconProps } from '@fluentui/react'
import type { StandardFC } from '~types/StandardFC'
import styles from './index.module.scss'
import cx from 'classnames'

interface IconButtonProps {
	title?: string
	icon: string
	text?: string
	className?: string
	active?: boolean
}

export const IconButton: StandardFC<IconButtonProps> = function IconButton({
	icon: iconName,
	className,
	children,
	onClick,
	text,
	title,
	active
}) {
	const icon: IIconProps = { iconName }
	return (
		<ActionButton
			className={cx(className, active ? styles.active : '')}
			iconProps={icon}
			onClick={onClick}
			text={text}
			title={title}
			style={{
				color: active ? 'var(--bs-primary-light)' : ''
			}}
		>
			{children}
		</ActionButton>
	)
}
