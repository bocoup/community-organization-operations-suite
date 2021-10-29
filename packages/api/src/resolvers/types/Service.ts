/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, Service as ServiceType, ServiceResolvers } from '@cbosuite/schema/dist/provider-types'
import { container } from 'tsyringe'
import { TagCollection } from '~db'
import { createGQLTag } from '~dto'
import { AppContext } from '~types'
import { empty } from '~utils/noop'

export const Service: ServiceResolvers<AppContext> = {
	tags: async (_: ServiceType) => {
		const tags = container.resolve(TagCollection)

		if (!_?.tags) return empty

		const result: Tag[] = []
		const tagArr = _.tags as any as string[]
		for (const tagId of tagArr) {
			const tag = await tags.itemById(tagId)
			if (tag?.item) {
				result.push(createGQLTag(tag.item))
			}
		}
		return result
	}
}
