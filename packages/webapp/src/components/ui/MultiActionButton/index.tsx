/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'

interface MultiActionButtonProps {
	onClick?: () => void
}

export const MultiActionButton: StandardFC<MultiActionButtonProps> = memo(
	function MultiActionButton({ onClick, className }) {
		return (
			<button
				className={cx(
					'btn btn-primary-light d-flex justify-content-center align-items-center',
					styles.multiActionButton,
					className
				)}
				onClick={onClick}
			>
				<Icon iconName='MoreVertical' />
			</button>
		)
	}
)
