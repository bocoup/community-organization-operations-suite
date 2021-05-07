/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import IconButton from '~ui/IconButton'

interface BoldLinkButtonProps extends ComponentProps {
	title?: string
	text?: string
	type?: 'button' | 'submit' | 'reset'
	icon?: string
	onClick?: () => void
}

export default function BoldLinkButton({
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
}
