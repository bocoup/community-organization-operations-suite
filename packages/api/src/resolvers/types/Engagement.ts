/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppContext } from '~types'
import {
	Engagement as EngagementType,
	EngagementResolvers
} from '@cbosuite/schema/lib/provider-types'
import { createGQLContact, createGQLUser } from '~dto'
import { sortByDate } from '~utils'

export const Engagement: EngagementResolvers<AppContext> = {
	user: async (_: EngagementType, args, context) => {
		if (!_.user) return null

		// if the user is already populated pass it along
		if (_.user.id) {
			return _.user
		}

		const userId = _.user as any as string
		const user = await context.collections.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for engagement')
		}

		return createGQLUser(user.item)
	},
	contacts: async (_: EngagementType, args, context) => {
		if (!_.contacts) return []

		const contactIds = _.contacts as any[] as string[]

		const contacts = await Promise.all([
			...contactIds.map(async (contactId) => {
				const contact = await context.collections.contacts.itemById(contactId)
				if (!contact.item) {
					throw new Error('contact not found for engagement')
				}
				return createGQLContact(contact.item)
			})
		])

		return contacts
	},
	tags: async (_: EngagementType, args, context) => {
		const engagementTags = (_.tags || []) as any as string[]

		const returnTags = await context.collections.tags.items({}, { id: { $in: engagementTags } })

		return returnTags.items ?? []
	},
	actions: async (_: EngagementType, args, context) => {
		return _.actions.sort(sortByDate)
	}
}
