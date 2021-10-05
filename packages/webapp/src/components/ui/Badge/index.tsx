/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'

interface BadgeProps {
	title?: string
	count?: number
}

export const Badge: StandardFC<BadgeProps> = memo(function Badge({ count }) {
	return (
		<>
			{count > 0 && (
				<div
					className={cx(
						'bg-warning d-flex justify-content-center align-items-center',
						styles.badge
					)}
				>
					<span>{count}</span>
				</div>
			)}
		</>
	)
})
