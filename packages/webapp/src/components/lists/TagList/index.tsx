/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import Tag from '~types/Tag'
import TagBadge from '~ui/TagBadge'

interface TagListProps extends ComponentProps {
	tags: Tag[]
}

export default function TagList({ tags }: TagListProps): JSX.Element {
	return (
		<>
			{tags.map((tag, i) => (
				<TagBadge tag={tag} key={tag.id} />
			))}
		</>
	)
}
