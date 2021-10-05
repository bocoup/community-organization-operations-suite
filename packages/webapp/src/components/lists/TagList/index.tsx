/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StandardFC } from '~types/StandardFC'
import { TagBadge } from '~ui/TagBadge'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { wrap } from '~utils/appinsights'

interface TagListProps {
	tags: Tag[]
	light?: boolean
}

export const TagList: StandardFC<TagListProps> = wrap(function TagList({ tags, light }) {
	return (
		<>
			{tags.length === 0 && <span>No tags</span>}
			{tags.map((tag, i) => (
				<TagBadge tag={tag} key={tag.id} light={light} />
			))}
		</>
	)
})
