/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IIconProps } from '@fluentui/react'
import React, { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'

interface IconButtonProps extends ComponentProps {
	title?: string
	icon: string
	text?: string
	className?: string
}

const IconButton = memo(function IconButton({
	icon: iconName,
	className,
	children,
	onClick,
	text
}: IconButtonProps): JSX.Element {
	const icon: IIconProps = { iconName }

	return (
		<ClientOnly>
			<ActionButton className={className} iconProps={icon} onClick={onClick} text={text}>
				{children}
			</ActionButton>
		</ClientOnly>
	)
})
export default IconButton
