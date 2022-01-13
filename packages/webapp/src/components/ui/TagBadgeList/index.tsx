/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { TagBadge } from '../TagBadge'
import { memo, useState } from 'react'

interface TagBadgeListProps {
	tags: Tag[]
	light?: boolean
}

export const TagBadgeList: StandardFC<TagBadgeListProps> = memo(function TagBadgeList({
	tags,
	light = false
}) {
	const [expanded, setExpanded] = useState<boolean>(false)

	if (!tags || tags.length < 1) {
		return <></>
	}

	return (
		<div className='tagBadgeList'>
			<TagBadge key={tags[0].id} tag={tags[0]} />
			{tags.length > 1 && (
				<button
					className={styles.expandButton}
					onClick={() => {
						setExpanded(!expanded)
					}}
				>
					+{tags.length - 1}
				</button>
			)}
			{expanded &&
				tags.map(function (tag, index) {
					return index > 0 ? <TagBadge key={tag.id} tag={tag} light={light} /> : ''
				})}
		</div>
	)
})
