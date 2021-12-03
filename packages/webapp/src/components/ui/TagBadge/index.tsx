/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'

interface TagBadgeProps {
	tag: Tag
	light?: boolean
}

export const TagBadge: StandardFC<TagBadgeProps> = memo(function TagBadge({
	tag,
	className,
	light = false
}) {
	return (
		<span
			className={cx(
				styles.tagBadge,
				'p-1 px-3 me-2',
				light ? 'bg-white text-primary-dark' : 'bg-dark text-white',
				className
			)}
		>
			{tag.label}
		</span>
	)
})
