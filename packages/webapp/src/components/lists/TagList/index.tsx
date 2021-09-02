/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withAITracking } from '@microsoft/applicationinsights-react-js'
import type ComponentProps from '~types/ComponentProps'
import TagBadge from '~ui/TagBadge'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'
import { reactPlugin } from '~utils/appinsights'

interface TagListProps extends ComponentProps {
	tags: Tag[]
	light?: boolean
}

const TagList = memo(function TagList({ tags, light }: TagListProps): JSX.Element {
	return (
		<>
			{tags.length === 0 && <span>No tags</span>}
			{tags.map((tag, i) => (
				<TagBadge tag={tag} key={tag.id} light={light} />
			))}
		</>
	)
})
export default withAITracking(reactPlugin, TagList)
