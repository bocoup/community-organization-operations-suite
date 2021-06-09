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
import { DbUser, DbAction, DbContact } from '~db'
import {
	createGQLContact,
	createGQLOrganization,
	createGQLUser,
	createGQLEngagement,
	createDBEngagement,
	createDBUser,
	createDBAction,
} from '~dto'
import sortByDate from '../utils/sortByDate'

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
			if (!result.item) {
				return null
			}
			const userEngagementCount: number = await context.collections.engagements.count(
				{ user_id: result.item.id, status: { $ne: 'CLOSED' } }
			)
			return createGQLUser(result.item, userEngagementCount)
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

			const userId = args.userId || undefined
			const exclude_userId = args.exclude_userId || false

			const result = await context.collections.engagements.items(
				{ offset, limit },
				userId
					? {
							org_id: orgId,
							user_id: exclude_userId ? { $ne: userId } : { $eq: userId },
							status: { $ne: 'CLOSED' },
					  }
					: { org_id: orgId, status: { $ne: 'CLOSED' } }
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
			const found: any = users.map((u) => u.item).filter((t) => !!t) as DbUser[]

			const userEngagementCounts: number[] = await Promise.all(
				found.map((u: DbUser) =>
					context.collections.engagements.count({
						user_id: u.id,
						status: { $ne: 'CLOSED' },
					})
				)
			)
			return found.map((u: DbUser, index: number) =>
				createGQLUser(u, userEngagementCounts[index])
			)
		},
		contacts: async (_: Organization, args, context) => {
			const contactIds = (_.contacts as any) as string[]
			const contacts = await Promise.all(
				contactIds.map((contactId) =>
					context.collections.contacts.itemById(contactId)
				)
			)
			const found = contacts
				.map((c) => c.item)
				.filter((t) => !!t) as DbContact[]
			return found.map((c: DbContact) => createGQLContact(c))
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
		taggedUser: async (_: Action, args, context) => {
			if (!_.taggedUser) return null

			const taggedUserId = (_.taggedUser as any) as string
			const taggedUser = await context.collections.users.itemById(taggedUserId)

			if (!taggedUser.item) {
				throw new Error('user not found for action')
			}

			return createGQLUser(taggedUser.item)
		},
		tags: async (_: Action, args, context) => {
			if (!_.tags) return null

			const returnTags: Tag[] = []
			// Get orgId from action
			const orgId = (_.orgId as any) as string
			const actionTags = (_.tags as any) as string[]

			// Load org from db
			const org = await context.collections.orgs.itemById(orgId)

			// Assign org tags to action
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

			const orgId = _.orgId as string
			const engagementTags = ((_.tags || []) as any) as string[]

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
		actions: async (_: Engagement, args, context) => {
			return _.actions.sort(sortByDate)
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
		createEngagement: async (_, { body }, context) => {
			// Create a dbabase object from input values
			const nextEngagement = createDBEngagement({ ...body })

			// Insert engagement into enagements collection
			await context.collections.engagements.insertItem(nextEngagement)

			// User who created the request
			const user = context.auth.identity?.id
			if (!user) throw Error('Unauthorized createEngagement')

			// Create two actions. one for create one for assignment

			// Create action
			const actionsToAssign: DbAction[] = [
				createDBAction({
					comment: 'Created request',
					orgId: body.orgId,
					userId: user,
				}),
			]

			if (body.userId && user !== body.userId) {
				// Get user to be assigned
				const userToAssign = await context.collections.users.itemById(
					body.userId
				)
				if (!userToAssign.item) {
					throw Error('Unable to assign engagement, user not found')
				}

				// Create assignment action
				actionsToAssign.unshift(
					createDBAction({
						comment: `Assigned ${userToAssign.item.user_name} request`,
						orgId: body.orgId,
						userId: user,
						taggedUserId: userToAssign.item.id,
					})
				)
			}

			if (body.userId && user === body.userId) {
				// Create claimed action
				actionsToAssign.unshift(
					createDBAction({
						comment: `Claimed request`,
						orgId: body.orgId,
						userId: user,
						taggedUserId: user,
					})
				)
			}

			// Assign new action to engagement
			await context.collections.engagements.updateItem(
				{ id: nextEngagement.id },
				{
					$push: {
						actions: {
							$each: actionsToAssign,
						},
					},
				}
			)

			// Update the object to be returned to the client
			nextEngagement.actions = [
				...nextEngagement.actions,
				...actionsToAssign,
			].sort(sortByDate)

			// Return created engagement
			return {
				engagement: createGQLEngagement(nextEngagement),
				message: 'Success',
			}
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

			// Create action for assignment or claimed
			let dbAction: DbAction | undefined = undefined
			const currentUserId = context.auth.identity?.id

			if (currentUserId && userId !== currentUserId) {
				// Create assignment action
				dbAction = createDBAction({
					comment: `Assigned ${user.item.user_name} request`,
					orgId: engagement.item.org_id,
					userId: user.item.id,
					taggedUserId: user.item.id,
				})
			}

			if (currentUserId && userId === currentUserId) {
				// Create claimed action
				dbAction = createDBAction({
					comment: `Claimed request`,
					orgId: engagement.item.org_id,
					userId: currentUserId,
					taggedUserId: currentUserId,
				})
			}

			if (dbAction) {
				await context.collections.engagements.updateItem(
					{ id },
					{ $push: { actions: dbAction } }
				)
				engagement.item.actions = [...engagement.item.actions, dbAction].sort(
					sortByDate
				)
			}

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
		addEngagementAction: async (_, { id, action }, context) => {
			//  Get engagement from db
			const engagement = await context.collections.engagements.itemById(id)

			// If not found
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set actions
			const nextAction: DbAction = createDBAction(action)

			await context.collections.engagements.updateItem(
				{ id },
				{ $push: { actions: nextAction } }
			)
			engagement.item.actions = [...engagement.item.actions, nextAction].sort(
				sortByDate
			)

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
		createNewUser: async (_, { user }, context) => {
			const checkUser = await context.collections.users.count({
				email: user.email,
			})

			if (checkUser !== 0) {
				return { user: null, message: 'Email already exists' }
			}

			// Generate random password
			const password = context.components.authenticator.generatePassword(16)

			// Create a dbabase object from input values
			const newUser = createDBUser(user, password)

			await Promise.all([
				context.collections.users.insertItem(newUser),
				context.collections.orgs.updateItem(
					{ id: newUser.roles[0].org_id },
					{ $push: { users: newUser.id } }
				),
			])

			// Send email
			console.log(password)

			return {
				user: createGQLUser(newUser),
				message: 'Success',
			}
		},
	},
}
