/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IIconProps } from '@fluentui/react'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'

interface IconButtonProps {
	title?: string
	icon: string
	text?: string
	className?: string
}

export const IconButton: StandardFC<IconButtonProps> = memo(function IconButton({
	icon: iconName,
	className,
	children,
	onClick,
	text,
	title
}) {
	const icon: IIconProps = { iconName }
	return (
		<ActionButton
			className={className}
			iconProps={icon}
			onClick={onClick}
			text={text}
			title={title}
		>
			{children}
		</ActionButton>
	)
})
