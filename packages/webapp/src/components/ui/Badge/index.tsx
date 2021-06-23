/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

interface BadgeProps extends ComponentProps {
	title?: string
	count?: number
}

const Badge = memo(function Badge({ count }: BadgeProps): JSX.Element {
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
export default Badge
