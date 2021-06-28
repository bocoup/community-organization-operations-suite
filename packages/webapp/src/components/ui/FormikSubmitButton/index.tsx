/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'

interface FormikSubmitButtonProps extends ComponentProps {
	text?: string
	type?: string
	disabled?: boolean
	onClick?: () => void
}

const FormikSubmitButton = memo(function FormikSubmitButton({
	className,
	text,
	onClick,
	disabled,
	type = 'submit',
	children
}: FormikSubmitButtonProps): JSX.Element {
	return (
		<PrimaryButton
			disabled={disabled}
			className={cx('py-4', className)}
			text={text}
			onClick={() => onClick?.()}
			type={type}
		>
			{children}
		</PrimaryButton>
	)
})
export default FormikSubmitButton
