/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Attribute,
	Contact as ContactType,
	ContactResolvers
} from '@greenlight/schema/lib/provider-types'
import { AppContext } from '~types'
import { createGQLEngagement } from '~dto'
import { createGQLAttribute } from '~dto/createGQLAttribute'

export const Contact: ContactResolvers<AppContext> = {
	engagements: async (_: ContactType, args, context) => {
		const engagements = await context.collections.engagements.items(
			{},
			{
				contact_id: _.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
		return eng
	},
	attributes: async (_: ContactType, args, context) => {
		const contact = await context.collections.contacts.itemById(_.id)

		const orgData = await context.collections.orgs.itemById(String(contact.item?.org_id))
		const attributes: Attribute[] = []

		if (contact.item?.attributes) {
			contact.item?.attributes.forEach((attrId) => {
				const attr = orgData.item?.attributes?.find((a) => a.id === attrId)
				if (attr) {
					attributes.push(createGQLAttribute(attr))
				}
			})
		}
		return attributes
	}
}
