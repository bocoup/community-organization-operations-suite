/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

interface RequestActionInputProps extends ComponentProps {
	title?: string
}

const RequestActionInput = memo(function RequestActionInput({
	className
}: RequestActionInputProps): JSX.Element {
	return (
		<div className={cx(styles.requestActionInput, className)}>
			{/* Input field */}

			{/* Actions */}
		</div>
	)
})
export default RequestActionInput
