/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppContext } from '~types'
import { Action as ActionType, ActionResolvers } from '@cbosuite/schema/dist/provider-types'
import { createGQLTag, createGQLUser } from '~dto'

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
		if (!_.tags) return []

		const returnTags = await context.collections.tags.items(
			{},
			{ id: { $in: _.tags as any as string[] } }
		)

		return returnTags?.items.map(createGQLTag) ?? []
	}
}
