/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppContext } from '~types'
import { Action as ActionType, Tag, ActionResolvers } from '@greenlight/schema/lib/provider-types'
import { createGQLUser } from '~dto'

export const Action: ActionResolvers<AppContext> = {
	user: async (_: ActionType, args, context) => {
		const userId = _.user as any as string
		const user = await context.collections.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for action')
		}
		return createGQLUser(user.item)
	},
	taggedUser: async (_: ActionType, args, context) => {
		if (!_.taggedUser) return null

		const taggedUserId = _.taggedUser as any as string
		const taggedUser = await context.collections.users.itemById(taggedUserId)

		if (!taggedUser.item) {
			throw new Error('user not found for action')
		}

		return createGQLUser(taggedUser.item)
	},
	tags: async (_: ActionType, args, context) => {
		if (!_.tags) return null

		const returnTags: Tag[] = []
		// Get orgId from action
		const orgId = _.orgId as any as string
		const actionTags = _.tags as any as string[]

		// Load org from db
		const org = await context.collections.orgs.itemById(orgId)

		// Assign org tags to action
		if (org.item && org.item.tags) {
			for (const tagKey of actionTags) {
				const tag = org.item.tags.find((orgTag) => orgTag.id === tagKey)
				if (tag) {
					returnTags.push(tag)
				}
			}
		}
		return returnTags
	}
}
