/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Organization as OrganizationType,
	OrganizationResolvers
} from '@cbosuite/schema/dist/provider-types'
import { DbUser, DbContact } from '~db'
import { createGQLContact, createGQLUser } from '~dto'
import { sortByProp } from '~utils'
import { AppContext } from '~types'
import { createGQLTag } from '~dto/createGQLTag'
import { empty } from '~utils/noop'

export const Organization: OrganizationResolvers<AppContext> = {
	users: async (_: OrganizationType, _args, { collections: { users } }) => {
		const userIds: string[] = _.users ?? empty
		const userItems = await Promise.all(userIds.map((userId) => users.itemById(userId)))
		const found: any = userItems.map((u) => u.item).filter((t) => !!t) as DbUser[]
		return found.map(createGQLUser)
	},
	contacts: async (_: OrganizationType, _args, { collections: { contacts } }) => {
		const contactIds: string[] = _.contacts ?? empty
		const contactItems = await Promise.all(
			contactIds.map((contactId) => contacts.itemById(contactId))
		)
		const found = contactItems.map((c) => c.item).filter((t) => !!t) as DbContact[]
		return found
			.map(createGQLContact)
			.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	tags: async (_: OrganizationType, _args, { collections: { tags } }) => {
		const dbTags = await tags.items({}, { org_id: _.id })
		const newTags = dbTags.items?.map(createGQLTag)
		return sortByProp(newTags, 'label')
	}
}
