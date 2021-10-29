/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact as ContactType, ContactResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'
import { createGQLEngagement, createGQLTag } from '~dto'
import { container } from 'tsyringe'
import { ContactCollection, EngagementCollection, TagCollection } from '~db'
import { empty } from '~utils/noop'

export const Contact: ContactResolvers<AppContext> = {
	engagements: async (_: ContactType) => {
		const engagements = container.resolve(EngagementCollection)
		const { items: result } = await engagements.items(
			{},
			{
				contacts: _.id
			}
		)
		const eng = result.map(createGQLEngagement)
		return eng
	},
	tags: async (_: ContactType) => {
		const contacts = container.resolve(ContactCollection)
		const tags = container.resolve(TagCollection)
		const contact = await contacts.itemById(_.id)

		// Get contact tags
		const dbTagResponse = await tags.items({}, { id: { $in: contact.item?.tags ?? [] } })
		return dbTagResponse.items?.map(createGQLTag) ?? empty
	}
}
