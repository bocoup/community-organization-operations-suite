/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IIconProps } from '@fluentui/react'
import type ComponentProps from '~types/ComponentProps'

interface IconButtonProps extends ComponentProps {
	title?: string
	onClick?: (arg: any | undefined) => void
	icon: string
	text?: string
	className?: string
}

export default function IconButton({
	icon: iconName,
	className,
	children,
	onClick,
	text
}: IconButtonProps): JSX.Element {
	const icon: IIconProps = { iconName }

	return (
		<ActionButton className={className} iconProps={icon} onClick={onClick} text={text}>
			{children}
		</ActionButton>
	)
}
