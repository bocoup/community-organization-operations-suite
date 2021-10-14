/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers, Contact, EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import {
	createGQLContact,
	createGQLOrganization,
	createGQLUser,
	createGQLEngagement,
	createGQLService
} from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { AppContext } from '~types'
import { sortByDate, createLogger } from '~utils'

const logger = createLogger('queries', true)

export const Query: QueryResolvers<AppContext> = {
	organizations: async (_, { body }, context) => {
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit
		const result = await context.collections.orgs.items({ offset, limit })
		return result.items.map(createGQLOrganization)
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
		return createGQLUser(result.item)
	},
	contact: async (_, { body }, context) => {
		const contactResponse = await context.collections.contacts.itemById(body.contactId)

		if (!contactResponse.item) {
			logger(`No contact found for ${body.contactId}`)
			return null
		}
		const dbContact = contactResponse.item
		return dbContact ? createGQLContact(dbContact) : null
	},
	contacts: async (_, { body }, context) => {
		const offset = body.offset || context.config.defaultPageOffset
		const limit = body.limit || context.config.defaultPageLimit
		const dbContacts = await context.collections.contacts.items(
			{ offset, limit },
			{ org_id: body.orgId }
		)

		const contactList = dbContacts.items.map(createGQLContact)
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
			.map(createGQLEngagement)
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
			.map(createGQLEngagement)
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
			.map(createGQLEngagement)
	},
	services: async (_, { body }, context) => {
		const result = await context.collections.services.items(
			{},
			{
				org_id: body.orgId
			}
		)

		return result.items.map(createGQLService)
	},
	serviceAnswers: async (_, { body }, context) => {
		const serviceId = body.serviceId
		const result = await context.collections.serviceAnswers.items({}, { service_id: serviceId })
		return result.items.map(createGQLServiceAnswer)
	}
}
