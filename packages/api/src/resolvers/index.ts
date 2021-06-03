/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import isEmpty from 'lodash/isEmpty'
import { IResolvers } from 'mercurius'
import { AppContext } from '../types'
import { Long } from './Long'
import {
	Organization,
	Resolvers,
	Action,
	Tag,
	Engagement,
} from '@greenlight/schema/lib/provider-types'
import { DbUser } from '~db'
import {
	createGQLContact,
	createGQLOrganization,
	createGQLUser,
	createGQLEngagement,
} from '~dto'

export const resolvers: Resolvers<AppContext> & IResolvers<any, AppContext> = {
	Long,
	Query: {
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
			return result.item ? createGQLUser(result.item) : null
		},
		contact: async (_, { contactId }, context) => {
			const result = await context.collections.contacts.itemById(contactId)
			return result.item ? createGQLContact(result.item) : null
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
				{ org_id: orgId }
			)

			return result.items.map((r) => createGQLEngagement(r))
		},
	},
	Organization: {
		users: async (_: Organization, args, context) => {
			const userIds = (_.users as any) as string[]
			const users = await Promise.all(
				userIds.map((userId) => context.collections.users.itemById(userId))
			)
			const found = users.map((u) => u.item).filter((t) => !!t) as DbUser[]
			return found.map((u: DbUser) => createGQLUser(u))
		},
	},

	Action: {
		user: async (_: Action, args, context) => {
			const userId = (_.user as any) as string
			const user = await context.collections.users.itemById(userId)
			if (!user.item) {
				throw new Error('user not found for action')
			}
			return createGQLUser(user.item)
		},
		tags: async (_: Action, args, context) => {
			const returnTags: Tag[] = []

			const orgId = (_.orgId as any) as string
			const actionTags = _.tags as string[]

			const org = await context.collections.orgs.itemById(orgId)
			if (org.item && org.item.tags) {
				for (const tagKey of actionTags) {
					const tag = org.item.tags.find((orgTag) => orgTag.id === tagKey)
					if (tag) {
						returnTags.push(tag)
					}
				}
			}
			return returnTags
		},
	},
	Engagement: {
		user: async (_: Engagement, args, context) => {
			if (!_.user) return null

			// if the user is already populated pass it along
			if (_.user.id) {
				return _.user
			}

			const userId = (_.user as any) as string
			const user = await context.collections.users.itemById(userId)
			if (!user.item) {
				throw new Error('user not found for engagement')
			}

			return createGQLUser(user.item)
		},
		contact: async (_: Engagement, args, context) => {
			if (!_.contact) throw new Error('Null contact')

			// if the contact is already populated pass it along
			if (_.contact.id) {
				return _.contact
			}

			const contactId = (_.contact as any) as string
			const contact = await context.collections.contacts.itemById(contactId)
			if (!contact.item) {
				throw new Error('contact not found for engagement')
			}

			return createGQLContact(contact.item)
		},
		tags: async (_: Engagement, args, context) => {
			const returnTags: Tag[] = []

			const orgId = (_.orgId as any) as string
			const engagementTags = _.tags as string[]

			const org = await context.collections.orgs.itemById(orgId)
			if (org.item && org.item.tags) {
				for (const tagKey of engagementTags) {
					const tag = org.item.tags.find((orgTag) => orgTag.id === tagKey)
					if (tag) {
						returnTags.push(tag)
					}
				}
			}
			return returnTags
		},
	},
	Mutation: {
		authenticate: async (_, { username, password }, context) => {
			if (!isEmpty(username) && !isEmpty(password)) {
				const {
					user,
					token,
				} = await context.components.authenticator.authenticateBasic(
					username,
					password
				)
				if (user) {
					return {
						accessToken: token,
						user: createGQLUser(user),
						message: 'Auth Success',
					}
				}
			}
			return { user: null, message: 'Auth failure' }
		},
		assignEngagement: async (_, { id, userId }, context) => {
			const [engagement, user] = await Promise.all([
				context.collections.engagements.itemById(id),
				context.collections.users.itemById(userId),
			])
			if (!user.item) {
				return { engagement: null, message: 'User Not found' }
			}
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set assignee
			await context.collections.engagements.updateItem(
				{ id },
				{ $set: { user_id: userId } }
			)

			const updatedEngagement = {
				...createGQLEngagement(engagement.item),
				user: createGQLUser(user.item),
			}

			// Return updated engagement
			return {
				engagement: updatedEngagement,
				message: 'Success',
			}
		},
		setEngagementStatus: async (_, { id, status }, context) => {
			const engagement = await context.collections.engagements.itemById(id)
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set status
			await context.collections.engagements.updateItem(
				{ id },
				{ $set: { status } }
			)
			engagement.item.status = status

			return {
				engagement: createGQLEngagement(engagement.item),
				message: 'Success',
			}
		},
		resetUserPassword: async (_, { id }, context) => {
			const user = await context.collections.users.itemById(id)

			if (!user.item) {
				return { user: null, message: 'User Not found' }
			}

			const response = await context.components.authenticator.resetPassword(
				user.item
			)

			if (!response) {
				return { user: null, message: 'Error resetting password' }
			}

			return { user: createGQLUser(user.item), message: 'Success' }
		},
		setUserPassword: async (_, { password }, context) => {
			const user = context.auth.identity as DbUser

			const response = await context.components.authenticator.setPassword(
				user,
				password
			)

			if (!response) {
				return { user: null, message: 'Error setting password' }
			}

			return { user: createGQLUser(user), message: 'Success' }
		},
	},
}
