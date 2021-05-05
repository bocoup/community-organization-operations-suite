/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

interface RequestActionInputProps extends ComponentProps {
	title?: string
}

export default function RequestActionInput({ className }: RequestActionInputProps): JSX.Element {
	return (
		<div className={cx(styles.requestActionInput, className)}>
			{/* Input field */}

			{/* Actions */}
		</div>
	)
}
