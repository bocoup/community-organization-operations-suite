/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppContext } from '~types'
import { Action as ActionType, ActionResolvers } from '@cbosuite/schema/dist/provider-types'
import { createGQLTag, createGQLUser } from '~dto'
import { TagCollection, UserCollection } from '~db'
import { container } from 'tsyringe'
import { empty } from '~utils/noop'

export const Action: ActionResolvers<AppContext> = {
	user: async (_: ActionType) => {
		const users = container.resolve(UserCollection)
		const userId = _.user as any as string
		const user = await users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for action')
		}
		return createGQLUser(user.item, true)
	},
	taggedUser: async (_: ActionType) => {
		if (!_.taggedUser) return null

		const users = container.resolve(UserCollection)
		const taggedUserId = _.taggedUser as any as string
		const taggedUser = await users.itemById(taggedUserId)

		if (!taggedUser.item) {
			throw new Error('user not found for action')
		}

		return createGQLUser(taggedUser.item, true)
	},
	tags: async (_: ActionType) => {
		if (!_.tags) return empty
		const tags = container.resolve(TagCollection)
		const returnTags = await tags.items({}, { id: { $in: _.tags as any as string[] } })
		return returnTags?.items.map(createGQLTag) ?? []
	}
}
