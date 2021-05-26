/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Tag } from '@greenlight/schema/lib/client-types'

interface TagBadgeProps extends ComponentProps {
	tag: Tag
}

export default function TagBadge({ tag, className }: TagBadgeProps): JSX.Element {
	console.log('tag', tag)

	return (
		<span className={cx(styles.tagBadge, 'bg-white text-secondary p-1 px-3 me-2', className)}>
			{tag.label}
		</span>
	)
}
