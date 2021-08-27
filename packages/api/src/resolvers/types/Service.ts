/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, Service as ServiceType, ServiceResolvers } from '@cbosuite/schema/lib/provider-types'
import { createGQLTag } from '~dto'
import { AppContext } from '~types'

export const Service: ServiceResolvers<AppContext> = {
	tags: async (_: ServiceType, args, context) => {
		const tags: Tag[] = []
		if (!_?.tags) return tags

		const tagArr = _.tags as any as string[]
		for (const tagId of tagArr) {
			const tag = await context.collections.tags.itemById(tagId)
			if (tag?.item) {
				tags.push(createGQLTag(tag.item))
			}
		}
		return tags
	}
}
