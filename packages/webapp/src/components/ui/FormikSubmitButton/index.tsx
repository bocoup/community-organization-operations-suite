/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { noop } from '~utils/noop'

interface FormikSubmitButtonProps {
	text?: string
	type?: string
	disabled?: boolean
	onClick?: () => void
}

export const FormikSubmitButton: StandardFC<FormikSubmitButtonProps> = memo(
	function FormikSubmitButton({
		className,
		text,
		onClick = noop,
		disabled,
		type = 'submit',
		children
	}) {
		return (
			<PrimaryButton
				disabled={disabled}
				className={cx('py-4', className)}
				text={text}
				onClick={onClick}
				type={type}
			>
				{children}
			</PrimaryButton>
		)
	}
)
