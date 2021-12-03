/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'

interface MentionBadgeProps {
	light?: boolean
}

export const MentionBadge: StandardFC<MentionBadgeProps> = memo(function MentionBadge({
	children,
	className,
	light = false
}) {
	return (
		<span
			className={cx(
				styles.mentionBadge,
				'p-1 px-3 me-2',
				light ? 'bg-light text-primary-dark' : 'bg-gray text-light',
				className
			)}
		>
			{/* TODO: Change to link? */}
			<strong>{children}</strong>
		</span>
	)
})
