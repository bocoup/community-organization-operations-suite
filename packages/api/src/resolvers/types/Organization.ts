/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Organization as OrganizationType,
	OrganizationResolvers
} from '@cbosuite/schema/dist/provider-types'
import { createGQLContact, createGQLUser } from '~dto'
import { AppContext } from '~types'
import { createGQLTag } from '~dto/createGQLTag'
import { empty } from '~utils/noop'
import { container } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { ContactCollection } from '~db/ContactCollection'
import { TagCollection } from '~db/TagCollection'

export const Organization: OrganizationResolvers<AppContext> = {
	users: async (_: OrganizationType, _args) => {
		const users = container.resolve(UserCollection)
		const result = await users.findUsersWithOrganization(_.id)
		const orgUsers = result.items ?? empty
		return orgUsers.map((u) => createGQLUser(u, true))
	},
	contacts: async (_: OrganizationType, _args) => {
		const contacts = container.resolve(ContactCollection)
		const result = await contacts.findContactsWithOrganization(_.id)
		const orgContacts = result.items ?? empty
		return orgContacts
			.map(createGQLContact)
			.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	tags: async (_: OrganizationType, _args) => {
		const tags = container.resolve(TagCollection)
		const result = await tags.findTagsWithOrganization(_.id)
		const orgTags = result.items ?? empty
		return orgTags.map(createGQLTag)
	}
}
