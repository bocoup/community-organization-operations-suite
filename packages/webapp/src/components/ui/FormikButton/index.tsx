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
	onClick?: () => void
}

export default function FormikButton({
	className,
	text,
	onClick,
	type,
	children
}: FormikButtonProps): JSX.Element {
	return (
		<DefaultButton
			className={cx('py-4', className)}
			text={text}
			onClick={() => onClick?.()}
			type={type}
		>
			{children}
		</DefaultButton>
	)
}
