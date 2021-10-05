/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { IconButton } from '~ui/IconButton'

interface BoldLinkButtonProps {
	title?: string
	text?: string
	type?: 'button' | 'submit' | 'reset'
	icon?: string
	onClick?: () => void
}

export const BoldLinkButton: StandardFC<BoldLinkButtonProps> = memo(function BoldLinkButton({
	onClick,
	icon,
	text,
	type
}: BoldLinkButtonProps): JSX.Element {
	return (
		<>
			{icon && (
				<IconButton className='btn btn-link text-decoration-none' icon={icon}>
					<strong>{text.toUpperCase()}</strong>
				</IconButton>
			)}
			{!icon && (
				<button className='btn btn-link text-decoration-none' type={type} onClick={onClick}>
					<strong>{text.toUpperCase()}</strong>
				</button>
			)}
		</>
	)
})
