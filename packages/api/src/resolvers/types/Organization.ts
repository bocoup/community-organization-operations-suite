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

export const Organization: OrganizationResolvers<AppContext> = {
	users: async (_: OrganizationType, args, context) => {
		const userIds = _.users as any as string[]
		const users = await Promise.all(
			userIds.map((userId) => context.collections.users.itemById(userId))
		)
		const found: any = users.map((u) => u.item).filter((t) => !!t) as DbUser[]
		return found.map(createGQLUser)
	},
	contacts: async (_: OrganizationType, args, context) => {
		const contactIds = _.contacts as any as string[]

		if (!contactIds || contactIds.length === 0) {
			return []
		}

		const contacts = await Promise.all(
			contactIds.map((contactId) => context.collections.contacts.itemById(contactId))
		)
		const found = contacts.map((c) => c.item).filter((t) => !!t) as DbContact[]
		return found
			.map(createGQLContact)
			.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	tags: async (_: OrganizationType, args, context) => {
		// const tags = _.tags as any as Tag[]
		const tags = _.tags as any as string[]

		if (!tags || tags.length === 0) {
			return []
		}

		const dbTags = await context.collections.tags.items(
			{},
			{
				org_id: _.id
			}
		)

		const newTags = dbTags.items?.map(createGQLTag)
		return sortByProp(newTags, 'label')
	}
}
