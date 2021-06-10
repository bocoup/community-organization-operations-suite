/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'

interface FormikButtonProps extends ComponentProps {
	text?: string
	type?: string
	disabled?: boolean
	onClick?: () => void
}

export default function FormikButton({
	className,
	text,
	onClick,
	type,
	disabled,
	children
}: FormikButtonProps): JSX.Element {
	return (
		<DefaultButton
			disabled={disabled}
			className={cx('py-4', className)}
			text={text}
			onClick={() => onClick?.()}
			type={type}
		>
			{children}
		</DefaultButton>
	)
}
