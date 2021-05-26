/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import TagBadge from '~ui/TagBadge'
import type { Tag } from '@greenlight/schema/lib/client-types'

interface TagListProps extends ComponentProps {
	tags: Tag[]
	light?: boolean
}

export default function TagList({ tags, light }: TagListProps): JSX.Element {
	return (
		<>
			{tags.length === 0 && <span>No tags</span>}
			{tags.map((tag, i) => (
				<TagBadge tag={tag} key={tag.id} light={light} />
			))}
		</>
	)
}
