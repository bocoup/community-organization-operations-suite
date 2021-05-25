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
		engagements: async (_, args, context) => {
			const orgId = args.orgId
			const offset = args.offset || context.config.defaultPageOffset
			const limit = args.limit || context.config.defaultPageLimit
			const result = await context.collections.engagements.items(
				{ offset, limit },
				{ org_id: orgId }
			)

			console.log('orgId', orgId)

			console.log('engagements result', result)

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
	},
}
