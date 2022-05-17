/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { noop } from '~utils/noop'
import { useOffline } from '~hooks/useOffline'
import { isDisabled } from '~utils/forms'

interface FormikSubmitButtonProps {
	text?: string
	type?: string
	enableOffline?: boolean
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
		enableOffline = false,
		children
	}) {
		return (
			<PrimaryButton
				disabled={isDisabled(useOffline(), enableOffline, disabled)}
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
