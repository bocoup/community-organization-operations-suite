/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, Service as ServiceType, ServiceResolvers } from '@cbosuite/schema/lib/provider-types'
import { AppContext } from '~types'

export const Service: ServiceResolvers<AppContext> = {
	tags: async (_: ServiceType, args, context) => {
		const orgData = await context.collections.orgs.itemById(String(_.orgId))
		const tags: Tag[] = []

		if (_?.tags) {
			const tagArr = _.tags as any as string[]
			tagArr.forEach((tagId) => {
				const tag = orgData.item?.tags?.find((t) => t.id === tagId)
				if (tag) {
					tags.push(tag)
				}
			})
		}
		return tags
	}
}
