/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { noop } from '~utils/noop'
import { useOffline } from '~hooks/useOffline'
import { isDisabled } from '~utils/forms'

interface FormikButtonProps {
	text?: string
	type?: string
	enableOffline?: boolean
	disabled?: boolean
	onClick?: () => void
}

export const FormikButton: StandardFC<FormikButtonProps> = memo(function FormikButton({
	className,
	text,
	onClick = noop,
	type,
	enableOffline = false,
	disabled,
	children
}) {
	return (
		<DefaultButton
			disabled={isDisabled(useOffline(), enableOffline, disabled)}
			className={cx('py-4', className)}
			text={text}
			onClick={onClick}
			type={type}
		>
			{children}
		</DefaultButton>
	)
})
