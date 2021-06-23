/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers, Contact } from '@greenlight/schema/lib/provider-types'
import { createGQLContact, createGQLOrganization, createGQLUser, createGQLEngagement } from '~dto'
import { AppContext } from '~types'
import sortByDate from '~utils/sortByDate'

export const Query: QueryResolvers<AppContext> = {
	organizations: async (_, args, context) => {
		const offset = args.offset || context.config.defaultPageOffset
		const limit = args.limit || context.config.defaultPageLimit
		const result = await context.collections.orgs.items({ offset, limit })
		return result.items.map((r) => createGQLOrganization(r))
	},
	organization: async (_, { orgId }, context) => {
		const result = await context.collections.orgs.itemById(orgId)
		return result.item ? createGQLOrganization(result.item) : null
	},
	user: async (_, { userId }, context) => {
		const result = await context.collections.users.itemById(userId)
		if (!result.item) {
			return null
		}

		const [active, closed] = await Promise.all([
			await context.collections.engagements.count({
				user_id: result.item.id,
				status: { $ne: 'CLOSED' }
			}),
			await context.collections.engagements.count({
				user_id: result.item.id,
				status: { $eq: 'CLOSED' }
			})
		])

		return createGQLUser(result.item, { active, closed })
	},
	contact: async (_, { contactId }, context) => {
		const offset = context.config.defaultPageOffset
		const limit = context.config.defaultPageLimit
		const result = await context.collections.contacts.itemById(contactId)
		const engagements = await context.collections.engagements.items(
			{ offset, limit },
			{
				contact_id: result?.item?.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
		return result.item ? createGQLContact(result.item, eng) : null
	},
	contacts: async (_, args, context) => {
		const offset = args.offset || context.config.defaultPageOffset
		const limit = args.limit || context.config.defaultPageLimit
		const result = await context.collections.contacts.items(
			{ offset, limit },
			{ org_id: args.orgId }
		)

		const contactList = await Promise.all(
			result.items.map(async (r) => {
				const engagements = await context.collections.engagements.items(
					{ offset, limit },
					{
						contact_id: r.id
					}
				)
				const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
				return createGQLContact(r, eng)
			})
		)

		return contactList.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	engagement: async (_, { id }, context) => {
		const result = await context.collections.engagements.itemById(id)
		return result.item ? createGQLEngagement(result.item) : null
	},
	engagements: async (_, args, context) => {
		const orgId = args.orgId
		const offset = args.offset || context.config.defaultPageOffset
		const limit = args.limit || context.config.defaultPageLimit

		const result = await context.collections.engagements.items(
			{ offset, limit },
			{
				org_id: orgId,
				status: { $ne: 'CLOSED' }
			}
		)

		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map((r) => createGQLEngagement(r))
	},
	exportData: async (_, { orgId }, context) => {
		const result = await context.collections.engagements.items(
			{},
			{
				org_id: orgId
			}
		)

		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map((r) => createGQLEngagement(r))
	}
}
