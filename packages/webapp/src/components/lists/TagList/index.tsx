/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ComponentProps } from '~types/ComponentProps'
import { TagBadge } from '~ui/TagBadge'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { wrap } from '~utils/appinsights'

interface TagListProps extends ComponentProps {
	tags: Tag[]
	light?: boolean
}

export const TagList: FC<TagListProps> = wrap(
	memo(function TagList({ tags, light }) {
		return (
			<>
				{tags.length === 0 && <span>No tags</span>}
				{tags.map((tag, i) => (
					<TagBadge tag={tag} key={tag.id} light={light} />
				))}
			</>
		)
	})
)
