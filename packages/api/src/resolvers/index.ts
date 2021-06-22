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
	Contact,
	EngagementResponse
} from '@greenlight/schema/lib/provider-types'
import { DbUser, DbAction, DbContact, DbRole, DbMention, DbEngagement } from '~db'
import {
	createGQLContact,
	createGQLOrganization,
	createGQLUser,
	createGQLEngagement,
	createDBEngagement,
	createDBUser,
	createDBAction,
	createDBMention
} from '~dto'
import sortByDate from '../utils/sortByDate'
import sortByProp from '../utils/sortByProp'
import { createDBTag } from '~dto/createDBTag'
import { createDBContact } from '~dto/createDBContact'

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
	},

	Subscription: {
		engagementUpdate: {
			subscribe: async (root, { orgId }, { pubsub }) =>
				await pubsub.subscribe(`ORG_ENGAGEMENT_UPDATES_${orgId}`),
			resolve: (payload: EngagementResponse) => {
				return payload
			}
		}
	},
	Organization: {
		users: async (_: Organization, args, context) => {
			const userIds = (_.users as any) as string[]
			const users = await Promise.all(
				userIds.map((userId) => context.collections.users.itemById(userId))
			)
			const found: any = users.map((u) => u.item).filter((t) => !!t) as DbUser[]

			const [active, closed] = await Promise.all([
				(await Promise.all(
					found.map((u: DbUser) =>
						context.collections.engagements.count({
							user_id: u.id,
							status: { $ne: 'CLOSED' }
						})
					)
				)) as number[],
				(await Promise.all(
					found.map((u: DbUser) =>
						context.collections.engagements.count({
							user_id: u.id,
							status: { $eq: 'CLOSED' }
						})
					)
				)) as number[]
			])

			return found.map((u: DbUser, index: number) =>
				createGQLUser(u, { active: active[index], closed: closed[index] })
			)
		},
		contacts: async (_: Organization, args, context) => {
			const contactIds = (_.contacts as any) as string[]
			const contacts = await Promise.all(
				contactIds.map((contactId) => context.collections.contacts.itemById(contactId))
			)
			const found = contacts.map((c) => c.item).filter((t) => !!t) as DbContact[]
			const contactsPromises = found.map(async (c: DbContact) => {
				const engagements = await context.collections.engagements.items(
					{},
					{
						contact_id: c.id
					}
				)
				const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
				return createGQLContact(c, eng)
			})
			const contactsWithEngagements = await Promise.all(contactsPromises)
			return contactsWithEngagements
		},
		tags: async (_: Organization, args, context) => {
			const tags = (_.tags as any) as Tag[]
			const [engagement, actions] = await Promise.all([
				(await Promise.all(
					tags.map((tag) =>
						context.collections.engagements.count({
							org_id: { $eq: _.id },
							tags: { $eq: tag.id }
						})
					)
				)) as number[],
				(await Promise.all(
					tags.map((tag) =>
						context.collections.engagements.count({
							org_id: { $eq: _.id },
							'actions.tags': { $eq: tag.id }
						})
					)
				)) as number[]
			])

			const newTags = tags.map((tag: Tag, idx: number) => {
				return {
					...tag,
					usageCount: {
						engagement: engagement[idx],
						actions: actions[idx]
					}
				}
			})

			return sortByProp(newTags, 'label')
		}
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
		}
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
		}
	},
	Mutation: {
		authenticate: async (_, { username, password }, context) => {
			if (!isEmpty(username) && !isEmpty(password)) {
				const { user, token } = await context.components.authenticator.authenticateBasic(
					username,
					password
				)
				if (user) {
					return {
						accessToken: token,
						user: createGQLUser(user),
						message: 'Auth Success'
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
			await context.pubsub.publish({
				topic: `ORG_ENGAGEMENT_UPDATES_${nextEngagement.org_id}`,
				payload: {
					action: 'CREATED',
					message: 'Success',
					engagement: createGQLEngagement(nextEngagement)
				}
			})

			// Create action
			const actionsToAssign: DbAction[] = [
				createDBAction({
					comment: 'Created request',
					orgId: body.orgId,
					userId: user
				})
			]

			if (body.userId && user !== body.userId) {
				// Get user to be assigned
				const userToAssign = await context.collections.users.itemById(body.userId)
				if (!userToAssign.item) {
					throw Error('Unable to assign engagement, user not found')
				}

				// Create assignment action
				actionsToAssign.unshift(
					createDBAction({
						comment: `Assigned ${userToAssign.item.user_name} request`,
						orgId: body.orgId,
						userId: user,
						taggedUserId: userToAssign.item.id
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
						taggedUserId: user
					})
				)
			}

			// Assign new action to engagement
			await context.collections.engagements.updateItem(
				{ id: nextEngagement.id },
				{
					$push: {
						actions: {
							$each: actionsToAssign
						}
					}
				}
			)

			// Update the object to be returned to the client
			nextEngagement.actions = [...nextEngagement.actions, ...actionsToAssign].sort(sortByDate)

			// Return created engagement
			return {
				engagement: createGQLEngagement(nextEngagement),
				message: 'Success'
			}
		},
		updateEngagement: async (_, { body }, context) => {
			if (!body?.engagementId) {
				throw Error('Engagement Request ID is required')
			}

			const result = await context.collections.engagements.itemById(body.engagementId)
			if (!result.item) {
				throw Error('Engagement request not found')
			}

			// User who created the request
			const user = context.auth.identity?.id
			if (!user) throw Error('Unauthorized updateEngagement')

			const current = result.item

			const changedItems: DbEngagement = {
				...current,
				contact_id: body.contactId,
				description: body.description,
				user_id: body.userId || undefined,
				tags: body.tags || []
			}

			await Promise.all([
				context.collections.engagements.updateItem(
					{ id: current.id },
					{
						$set: changedItems
					}
				),
				context.pubsub.publish({
					topic: `ORG_ENGAGEMENT_UPDATES_${changedItems.org_id}`,
					payload: {
						action: 'UPDATED',
						message: 'Success',
						engagement: createGQLEngagement(changedItems)
					}
				})
			])

			const actionsToAssign: DbAction[] = [
				createDBAction({
					comment: 'Updated the request',
					orgId: body.orgId,
					userId: user
				})
			]

			if (body.userId && body.userId !== current.user_id && user !== body.userId) {
				// Get user to be assigned
				const userToAssign = await context.collections.users.itemById(body.userId)

				if (!userToAssign.item) {
					actionsToAssign.unshift(
						createDBAction({
							comment: `removed assigned specialist`,
							orgId: body.orgId,
							userId: user,
							taggedUserId: undefined
						})
					)
				}

				// Create reassignment action
				actionsToAssign.unshift(
					createDBAction({
						comment: `Reassigned request to: ${userToAssign?.item?.user_name}`,
						orgId: body.orgId,
						userId: user,
						taggedUserId: userToAssign?.item?.id
					})
				)
			}

			// Assign new action to engagement
			await context.collections.engagements.updateItem(
				{ id: changedItems.id },
				{
					$push: {
						actions: {
							$each: actionsToAssign
						}
					}
				}
			)

			// Update the object to be returned to the client
			changedItems.actions = [...changedItems.actions, ...actionsToAssign].sort(sortByDate)

			// Return created engagement
			return {
				engagement: createGQLEngagement(changedItems),
				message: 'Success'
			}
		},
		assignEngagement: async (_, { id, userId }, context) => {
			const [engagement, user] = await Promise.all([
				context.collections.engagements.itemById(id),
				context.collections.users.itemById(userId)
			])
			if (!user.item) {
				return { engagement: null, message: 'User Not found' }
			}
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set assignee
			await context.collections.engagements.updateItem({ id }, { $set: { user_id: userId } })

			// Create action for assignment or claimed
			let dbAction: DbAction | undefined = undefined
			const currentUserId = context.auth.identity?.id

			if (currentUserId && userId !== currentUserId) {
				// Create assignment action
				dbAction = createDBAction({
					comment: `Assigned ${user.item.user_name} request`,
					orgId: engagement.item.org_id,
					userId: user.item.id,
					taggedUserId: user.item.id
				})
			}

			if (currentUserId && userId === currentUserId) {
				// Create claimed action
				dbAction = createDBAction({
					comment: `Claimed request`,
					orgId: engagement.item.org_id,
					userId: currentUserId,
					taggedUserId: currentUserId
				})
			}

			if (dbAction) {
				await context.collections.engagements.updateItem({ id }, { $push: { actions: dbAction } })
				engagement.item.actions = [...engagement.item.actions, dbAction].sort(sortByDate)
			}

			const updatedEngagement = {
				...createGQLEngagement(engagement.item),
				user: createGQLUser(user.item)
			}

			// Publish changes to websocketk connection
			await context.pubsub.publish({
				topic: `ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`,
				payload: {
					action: 'UPDATE',
					message: 'Success',
					engagement: updatedEngagement
				}
			})

			// Return updated engagement
			return {
				engagement: updatedEngagement,
				message: 'Success'
			}
		},
		completeEngagement: async (_, { id }, context) => {
			if (!context.auth.identity) {
				return { engagement: null, message: 'User not authenticated' }
			}

			const engagement = await context.collections.engagements.itemById(id)
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set status
			await context.collections.engagements.updateItem({ id }, { $set: { status: 'CLOSED' } })
			engagement.item.status = 'CLOSED'

			// Publish changes to websocketk connection
			await context.pubsub.publish({
				topic: `ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`,
				payload: {
					action: 'CLOSED',
					message: 'Success',
					engagement: createGQLEngagement(engagement.item)
				}
			})

			// Create action
			const currentUserId = context.auth.identity.id
			const nextAction = createDBAction({
				comment: `Marked the request compelete`,
				orgId: engagement.item.org_id,
				userId: currentUserId,
				taggedUserId: currentUserId
			})

			await context.collections.engagements.updateItem({ id }, { $push: { actions: nextAction } })
			engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

			return {
				engagement: createGQLEngagement(engagement.item),
				message: 'Success'
			}
		},
		setEngagementStatus: async (_, { id, status }, context) => {
			const engagement = await context.collections.engagements.itemById(id)
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set status
			await context.collections.engagements.updateItem({ id }, { $set: { status } })
			engagement.item.status = status

			return {
				engagement: createGQLEngagement(engagement.item),
				message: 'Success'
			}
		},
		addEngagementAction: async (_, { id, action }, context) => {
			if (!action.userId) {
				throw new Error('userId required')
			}

			//  Get engagement from db
			const engagement = await context.collections.engagements.itemById(id)

			// If not found
			if (!engagement.item) {
				return { engagement: null, message: 'Engagement not found' }
			}

			// Set actions
			const nextAction: DbAction = createDBAction(action)

			// Add a mention for the tagged user
			if (action.taggedUserId) {
				const taggedUser = await context.collections.users.itemById(action.taggedUserId)

				if (taggedUser.item) {
					const dbMention = createDBMention(engagement.item.id)
					await context.collections.users.updateItem(
						{ id: taggedUser.item.id },
						{ $push: { mentions: dbMention } }
					)
				}
			}

			await context.collections.engagements.updateItem({ id }, { $push: { actions: nextAction } })
			engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

			return {
				engagement: createGQLEngagement(engagement.item),
				message: 'Success'
			}
		},
		resetUserPassword: async (_, { id }, context) => {
			const user = await context.collections.users.itemById(id)

			if (!user.item) {
				return { user: null, message: 'User Not found' }
			}

			const response = await context.components.authenticator.resetPassword(user.item)

			if (!response) {
				return { user: null, message: 'Error resetting password' }
			}

			return { user: createGQLUser(user.item), message: 'Success' }
		},
		setUserPassword: async (_, { password }, context) => {
			const user = context.auth.identity as DbUser

			const response = await context.components.authenticator.setPassword(user, password)

			if (!response) {
				return { user: null, message: 'Error setting password' }
			}

			return { user: createGQLUser(user), message: 'Success' }
		},
		createNewUser: async (_, { user }, context) => {
			const checkUser = await context.collections.users.count({
				email: user.email
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
				context.app.nodemailer.sendMail({
					to: user.email,
					subject: 'Account Created',
					text: `Your Greenlight acount has been created. Please use this email address and the following password to login: ${password}`
				})
			])

			return {
				user: createGQLUser(newUser),
				message: 'Success'
			}
		},
		updateUser: async (_, { user }, context) => {
			if (!user.id) {
				return { user: null, message: 'User Id not provided' }
			}

			const result = await context.collections.users.itemById(user.id)

			if (!result.item) {
				return { user: null, message: 'User not found' }
			}
			const dbUser = result.item

			if (dbUser.email !== user.email) {
				const emailCheck = await context.collections.users.count({
					email: user.email
				})

				if (emailCheck !== 0) {
					return { user: null, message: 'Email already exists' }
				}
			}

			await context.collections.users.updateItem(
				{ id: dbUser.id },
				{
					$set: {
						first_name: user.first,
						middle_name: user.middle || undefined,
						last_name: user.last,
						user_name: user.userName,
						email: user.email,
						phone: user.phone || undefined,
						roles:
							user?.roles?.map((r) => {
								return {
									org_id: r.orgId,
									role_type: r.roleType
								} as DbRole
							}) || [],
						address: user?.address
							? {
									street: user.address?.street || '',
									unit: user.address?.unit || '',
									city: user.address?.city || '',
									state: user.address?.state || '',
									zip: user.address?.zip || ''
							  }
							: undefined,
						description: user.description || undefined,
						additional_info: user.additionalInfo || undefined
					}
				}
			)

			return {
				user: createGQLUser(dbUser),
				message: 'Success'
			}
		},
		markMentionSeen: async (_, { userId, engagementId }, context) => {
			const result = await context.collections.users.itemById(userId)

			if (!result.item) {
				return { user: null, message: 'User not found' }
			}

			const dbUser = result.item

			dbUser.mentions?.forEach((mention: DbMention) => {
				if (mention.engagement_id === engagementId) {
					mention.seen = true
				}
			})

			await context.collections.users.saveItem(dbUser)

			return { user: createGQLUser(dbUser), message: 'Success' }
		},

		createNewTag: async (_, { orgId, tag }, context) => {
			const newTag = createDBTag(tag)
			if (!orgId) {
				return { tag: null, message: 'Organization Id not found' }
			}

			await context.collections.orgs.updateItem({ id: orgId }, { $push: { tags: newTag } })

			return {
				tag: newTag,
				message: 'Success'
			}
		},
		updateTag: async (_, { orgId, tag }, context) => {
			if (!tag.id) {
				return { tag: null, message: 'Tag Id not provided' }
			}
			if (!orgId) {
				return { tag: null, message: 'Organization Id not found' }
			}

			await context.collections.orgs.updateItem(
				{ id: orgId, 'tags.id': tag.id },
				{
					$set: {
						'tags.$.label': tag.label,
						'tags.$.description': tag.description
					}
				}
			)

			return {
				tag: {
					id: tag.id || '',
					label: tag.label || '',
					description: tag.description || ''
				},
				message: 'Success'
			}
		},
		createContact: async (_, { contact }, context) => {
			if (!contact.orgId) {
				return { contact: null, message: 'Organization Id not found' }
			}

			const newContact = createDBContact(contact)

			await Promise.all([
				context.collections.contacts.insertItem(newContact),
				context.collections.orgs.updateItem(
					{ id: newContact.org_id },
					{ $push: { contacts: newContact.id } }
				)
			])

			return {
				contact: createGQLContact(newContact),
				message: 'Success'
			}
		},
		updateContact: async (_, { contact }, context) => {
			if (!contact.id) {
				return { contact: null, message: 'Contact Id not found' }
			}

			if (!contact.orgId) {
				return { contact: null, message: 'Organization Id not found' }
			}

			const result = await context.collections.contacts.itemById(contact.id)
			if (!result.item) {
				return { contact: null, message: 'User not found' }
			}
			const dbContact = result.item

			await context.collections.contacts.updateItem(
				{ id: dbContact.id },
				{
					$set: {
						first_name: contact.first,
						middle_name: contact.middle || undefined,
						last_name: contact.last,
						date_of_birth: contact.dateOfBirth || undefined,
						email: contact.email || undefined,
						phone: contact.phone || undefined,
						address: contact?.address
							? {
									street: contact.address?.street || '',
									unit: contact.address?.unit || '',
									city: contact.address?.city || '',
									state: contact.address?.state || '',
									zip: contact.address?.zip || ''
							  }
							: undefined
					}
				}
			)

			const offset = context.config.defaultPageOffset
			const limit = context.config.defaultPageLimit

			const engagements = await context.collections.engagements.items(
				{ offset, limit },
				{
					contact_id: dbContact.id
				}
			)
			const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
			const updatedContact = createDBContact(contact)
			return {
				contact: createGQLContact(updatedContact, eng),
				message: 'Success'
			}
		}
	}
}
