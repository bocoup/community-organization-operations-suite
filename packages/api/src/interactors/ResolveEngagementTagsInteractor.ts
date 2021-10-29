/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, Engagement } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { TagCollection } from '~db/TagCollection'
import { createGQLTag } from '~dto'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveEngagementTagsInteractor implements Interactor<Engagement, unknown, Tag[]> {
	public constructor(private tags: TagCollection) {}

	public async execute(_: Engagement) {
		const engagementTags = (_.tags || []) as any as string[]
		const returnTags = await this.tags.items({}, { id: { $in: engagementTags } })
		return returnTags?.items.map(createGQLTag) ?? empty
	}
}
