/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Action, Tag } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { TagCollection } from '~db/TagCollection'
import { createGQLTag } from '~dto'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveActionTagsInteractor implements Interactor<Action, unknown, Tag[]> {
	public constructor(private tags: TagCollection) {}

	public async execute(_: Action) {
		if (!_.tags) return empty
		const returnTags = await this.tags.items({}, { id: { $in: _.tags as any as string[] } })
		return returnTags?.items.map(createGQLTag) ?? empty
	}
}
