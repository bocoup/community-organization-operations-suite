/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

interface MentionBadgeProps extends ComponentProps {
	light?: boolean
}

const MentionBadge = memo(function MentionBadge({
	children,
	className,
	light = false
}: MentionBadgeProps): JSX.Element {
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
export default MentionBadge
