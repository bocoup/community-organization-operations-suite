/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact as ContactType, ContactResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'
import { createGQLEngagement, createGQLTag } from '~dto'

export const Contact: ContactResolvers<AppContext> = {
	engagements: async (_: ContactType, args, context) => {
		const engagements = await context.collections.engagements.items(
			{},
			{
				contacts: _.id
			}
		)
		const eng = engagements.items.map(createGQLEngagement)
		return eng
	},
	tags: async (_: ContactType, args, context) => {
		const contact = await context.collections.contacts.itemById(_.id)

		// Get contact tags
		const dbTagResponse = await context.collections.tags.items(
			{},
			{ id: { $in: contact.item?.tags ?? [] } }
		)
		const tags = dbTagResponse.items?.map(createGQLTag)

		return tags
	}
}
