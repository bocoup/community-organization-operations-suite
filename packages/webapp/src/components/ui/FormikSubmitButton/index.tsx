/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'

interface FormikSubmitButtonProps extends ComponentProps {
	text?: string
	type?: string
	onClick?: () => void
}

export default function FormikSubmitButton({
	className,
	text,
	onClick,
	type = 'submit',
	children
}: FormikSubmitButtonProps): JSX.Element {
	return (
		<PrimaryButton
			className={cx('py-4', className)}
			text={text}
			onClick={() => onClick?.()}
			type={type}
		>
			{children}
		</PrimaryButton>
	)
}
