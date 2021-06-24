/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'

interface FormikButtonProps extends ComponentProps {
	text?: string
	type?: string
	disabled?: boolean
	onClick?: () => void
}

const FormikButton = memo(function FormikButton({
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
})
export default FormikButton
