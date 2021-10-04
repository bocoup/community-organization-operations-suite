/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers, Contact, EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { DbContact } from '~db'
import {
	createGQLContact,
	createGQLOrganization,
	createGQLUser,
	createGQLEngagement,
	createGQLService
} from '~dto'
import { createGQLTag } from '~dto/createGQLTag'
import { AppContext } from '~types'
import { sortByDate } from '~utils'
import { createLogger } from '~utils'
const logger = createLogger('queries', true)

export const Query: QueryResolvers<AppContext> = {
	organizations: async (_, { body }, context) => {
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit
		const result = await context.collections.orgs.items({ offset, limit })
		return result.items.map((r) => createGQLOrganization(r))
	},
	organization: async (_, { body }, context) => {
		const result = await context.collections.orgs.itemById(body.orgId)
		return result.item ? createGQLOrganization(result.item) : null
	},
	user: async (_, { body }, context) => {
		const result = await context.collections.users.itemById(body.userId)
		if (!result.item) {
			return null
		}

		const [active, closed] = await Promise.all([
			await context.collections.engagements.count({
				user_id: result.item.id,
				status: { $ne: EngagementStatus.Closed }
			}),
			await context.collections.engagements.count({
				user_id: result.item.id,
				status: { $eq: EngagementStatus.Closed }
			})
		])

		return createGQLUser(result.item, { active, closed })
	},
	contact: async (_, { body }, context) => {
		const offset = context.config.defaultPageOffset
		const limit = context.config.defaultPageLimit
		const contactResponse = await context.collections.contacts.itemById(body.contactId)

		if (!contactResponse.item) {
			logger(`No contact found for ${body.contactId}`)
			return null
		}
		const dbContact = contactResponse.item

		// FIXME: this will only return for requests with individual contacts
		const engagements = await context.collections.engagements.items(
			{ offset, limit },
			{
				contacts: dbContact.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))

		const dbTagResponse = await context.collections.tags.items(
			{},
			{ id: { $in: dbContact.tags ?? [] } }
		)

		const tags = dbTagResponse.items?.map((dbTag) => createGQLTag(dbTag))

		return dbContact ? createGQLContact(dbContact, eng, tags) : null
	},
	contacts: async (_, { body }, context) => {
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit
		const dbContacts = await context.collections.contacts.items(
			{ offset, limit },
			{ org_id: body.orgId }
		)

		const contactList = await Promise.all(
			dbContacts.items.map(async (contact: DbContact) => {
				const engagements = await context.collections.engagements.items(
					{ offset, limit },
					{
						contacts: contact.id
					}
				)
				const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))

				const dbTagResponse = await context.collections.tags.items(
					{},
					{ id: { $in: contact.tags ?? [] } }
				)

				const tags = dbTagResponse.items?.map((dbTag) => createGQLTag(dbTag))

				return createGQLContact(contact, eng, tags)
			})
		)

		return contactList.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	engagement: async (_, { body }, context) => {
		const result = await context.collections.engagements.itemById(body.engId)
		return result.item ? createGQLEngagement(result.item) : null
	},
	activeEngagements: async (_, { body }, context) => {
		const orgId = body.orgId
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit

		const result = await context.collections.engagements.items(
			{ offset, limit },
			{
				org_id: orgId,
				status: { $nin: [EngagementStatus.Closed, EngagementStatus.Completed] }
			}
		)

		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map((r) => createGQLEngagement(r))
	},
	inactiveEngagements: async (_, { body }, context) => {
		const orgId = body.orgId
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit

		const result = await context.collections.engagements.items(
			{ offset, limit },
			{
				org_id: orgId,
				status: { $in: [EngagementStatus.Closed, EngagementStatus.Completed] }
			}
		)

		return result.items
			.sort((a, b) => sortByDate({ date: a.end_date as string }, { date: b.end_date as string }))
			.map((r) => createGQLEngagement(r))
	},
	exportData: async (_, { body }, context) => {
		const result = await context.collections.engagements.items(
			{},
			{
				org_id: body.orgId
			}
		)

		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map((r) => createGQLEngagement(r))
	},
	services: async (_, { body }, context) => {
		const result = await context.collections.services.items(
			{},
			{
				org_id: body.orgId
			}
		)

		return result.items.map((r) => createGQLService(r))
	}
}
