/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Tag } from '@resolve/schema/lib/client-types'
import { memo } from 'react'

interface TagBadgeProps extends ComponentProps {
	tag: Tag
	light?: boolean
}

const TagBadge = memo(function TagBadge({
	tag,
	className,
	light = false
}: TagBadgeProps): JSX.Element {
	return (
		<span
			className={cx(
				styles.tagBadge,
				'p-1 px-3 me-2',
				light ? 'bg-white text-secondary' : 'bg-dark text-light',
				className
			)}
		>
			{tag.label}
		</span>
	)
})
export default TagBadge
