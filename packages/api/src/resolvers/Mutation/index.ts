/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Attribute, MutationResolvers } from '@cbosuite/schema/lib/provider-types'
import isEmpty from 'lodash/isEmpty'
import { AppContext } from '~types'
import { DbUser, DbAction, DbRole, DbMention, DbEngagement, DbContact } from '~db'
import {
	createGQLContact,
	createGQLUser,
	createGQLEngagement,
	createGQLMention,
	createDBEngagement,
	createDBUser,
	createDBAction,
	createDBMention,
	createGQLTag,
	createDBService,
	createGQLService
} from '~dto'
import {
	getAccountCreatedHTMLTemplate,
	getForgotPasswordHTMLTemplate,
	getPasswordResetHTMLTemplate,
	isSendMailConfigured,
	sortByDate,
	validatePassword
} from '~utils'
import { createDBTag } from '~dto/createDBTag'
import { createDBContact } from '~dto/createDBContact'
import { createDBAttribute } from '~dto/createDBAttribute'
import { createGQLAttribute } from '~dto/createGQLAttribute'

export const Mutation: MutationResolvers<AppContext> = {
	authenticate: async (_, { body }, context) => {
		const { username, password } = body
		if (!isEmpty(username) && !isEmpty(password)) {
			const { user, token } = await context.components.authenticator.authenticateBasic(
				username,
				password
			)
			if (user) {
				return {
					accessToken: token,
					user: createGQLUser(user),
					message: context.components.localization.t('mutation.authenticate.success'),
					status: 'SUCCESS'
				}
			}
		}
		return {
			user: null,
			message: context.components.localization.t('mutation.authenticate.failed'),
			status: 'FAILED'
		}
	},
	createEngagement: async (_, { body }, context) => {
		// Create a dbabase object from input values
		const nextEngagement = createDBEngagement({ ...body })

		// Insert engagement into enagements collection
		await context.collections.engagements.insertItem(nextEngagement)

		// User who created the request
		const user = context.auth.identity?.id
		if (!user)
			throw Error(context.components.localization.t('mutation.createEngagement.unauthorized'))

		await context.pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${nextEngagement.org_id}`, {
			action: 'CREATED',
			message: context.components.localization.t('mutation.createEngagement.success'),
			engagement: createGQLEngagement(nextEngagement),
			status: 'SUCCESS'
		})

		// Create two actions. one for create one for assignment
		// Engagement create action
		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: context.components.localization.t(
					'mutation.createEngagement.actions.createRequest'
				),
				orgId: body.orgId,
				userId: user
			})
		]

		if (body.userId && user !== body.userId) {
			// Get user to be assigned
			const userToAssign = await context.collections.users.itemById(body.userId)
			if (!userToAssign.item) {
				throw Error(context.components.localization.t('mutation.createEngagement.unableToAssign'))
			}

			// User assignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: context.components.localization.t(
						'mutation.createEngagement.actions.assignedRequest',
						{ username: userToAssign.item.user_name }
					),
					orgId: body.orgId,
					userId: user,
					taggedUserId: userToAssign.item.id
				})
			)

			// Send assigned user a mention
			if (userToAssign.item) {
				const dbMention = createDBMention(
					nextEngagement.id,
					context.auth.identity?.id as string,
					undefined,
					actionsToAssign[0].comment
				)

				try {
					await context.collections.users.updateItem(
						{ id: userToAssign.item.id },
						{ $push: { mentions: dbMention } }
					)
				} catch (error) {
					throw error
				}

				// Publish changes to subscribed user
				await context.pubsub.publish(`USER_MENTION_UPDATES_${userToAssign.item.id}`, {
					action: 'CREATED',
					message: context.components.localization.t('mutation.addEngagementAction.success'),
					mention: createGQLMention(dbMention),
					status: 'SUCCESS'
				})
			}

			// Send fcm message if token is present on user
			if (userToAssign.item.fcm_token) {
				context.notify.assignedRequest(userToAssign.item.fcm_token)
			}
		}

		if (body.userId && user === body.userId) {
			// Create claimed action
			actionsToAssign.unshift(
				createDBAction({
					comment: context.components.localization.t(
						'mutation.createEngagement.actions.claimedRequest'
					),
					orgId: body.orgId,
					userId: user,
					taggedUserId: user
				})
			)

			// Set fcm token if present
			console.log('context.auth.identity?.fcm_token', context.auth.identity?.fcm_token)
			if (context.auth.identity?.fcm_token) {
				context.notify.assignedRequest(context.auth.identity.fcm_token)
			}
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
			message: context.components.localization.t('mutation.createEngagement.success'),
			status: 'SUCCESS'
		}
	},
	updateEngagement: async (_, { body }, context) => {
		if (!body?.engagementId) {
			throw Error(context.components.localization.t('mutation.updateEngagement.noRequestId'))
		}

		const result = await context.collections.engagements.itemById(body.engagementId)
		if (!result.item) {
			throw Error(context.components.localization.t('mutation.updateEngagement.requestNotFound'))
		}

		// User who created the request
		const user = context.auth.identity?.id
		if (!user)
			throw Error(context.components.localization.t('mutation.updateEngagement.unauthorized'))

		const current = result.item

		const changedItems: DbEngagement = {
			...current,
			title: body.title,
			contacts: body.contactIds,
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
			context.pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${changedItems.org_id}`, {
				action: 'UPDATED',
				message: context.components.localization.t('mutation.updateEngagement.success'),
				engagement: createGQLEngagement(changedItems),
				status: 'SUCCESS'
			})
		])

		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: context.components.localization.t(
					'mutation.updateEngagement.actions.updatedRequest'
				),
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
						comment: context.components.localization.t(
							'mutation.updateEngagement.actions.unassignRequest'
						),
						orgId: body.orgId,
						userId: user,
						taggedUserId: undefined
					})
				)
			}

			// Create reassignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: context.components.localization.t(
						'mutation.updateEngagement.actions.reassignRequest',
						{ username: userToAssign?.item?.user_name }
					),
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
			message: context.components.localization.t('mutation.updateEngagement.success'),
			status: 'SUCCESS'
		}
	},
	assignEngagement: async (_, { body }, context) => {
		const { engId: id, userId } = body
		const [engagement, user] = await Promise.all([
			context.collections.engagements.itemById(id),
			context.collections.users.itemById(userId)
		])
		if (!user.item) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.assignEngagement.userNotFound'),
				status: 'FAILED'
			}
		}
		if (!engagement.item) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.assignEngagement.requestNotFound'),
				status: 'FAILED'
			}
		}

		// Set assignee
		await context.collections.engagements.updateItem({ id }, { $set: { user_id: userId } })

		// Create action for assignment or claimed
		let dbAction: DbAction | undefined = undefined
		const currentUserId = context.auth.identity?.id

		if (currentUserId && userId !== currentUserId) {
			// Create assignment action
			dbAction = createDBAction({
				comment: context.components.localization.t(
					'mutation.assignEngagement.actions.assignedRequest',
					{ username: user.item.user_name }
				),
				orgId: engagement.item.org_id,
				userId: user.item.id,
				taggedUserId: user.item.id
			})

			// Send the user a push notification
			if (user.item.fcm_token) {
				console.log('attempting to send message to ', user.item.fcm_token)
				context.notify.sendMessage({
					token: user.item.fcm_token,
					notification: {
						title: 'A client needs your help!',
						body: 'Go to the dashboard to view this request'
					}
				})
			}
		}

		if (currentUserId && userId === currentUserId) {
			// Create claimed action
			dbAction = createDBAction({
				comment: context.components.localization.t(
					'mutation.assignEngagement.actions.claimedRequest'
				),
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
		await context.pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
			action: 'UPDATE',
			message: context.components.localization.t('mutation.assignEngagement.success'),
			engagement: updatedEngagement,
			status: 'SUCCESS'
		})

		// Return updated engagement
		return {
			engagement: updatedEngagement,
			message: context.components.localization.t('mutation.assignEngagement.success'),
			status: 'SUCCESS'
		}
	},
	completeEngagement: async (_, { body }, context) => {
		const { engId: id } = body
		if (!context.auth.identity) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.completeEngagement.unauthorized'),
				status: 'FAILED'
			}
		}

		const engagement = await context.collections.engagements.itemById(id)
		if (!engagement.item) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.completeEngagement.requestNotFound'),
				status: 'FAILED'
			}
		}

		// Set status
		await context.collections.engagements.updateItem({ id }, { $set: { status: 'COMPLETED' } })
		engagement.item.status = 'COMPLETED'

		// Publish changes to websocketk connection
		await context.pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
			action: 'COMPLETED',
			message: context.components.localization.t('mutation.completeEngagement.success'),
			engagement: createGQLEngagement(engagement.item),
			status: 'SUCCESS'
		})

		// Create action
		const currentUserId = context.auth.identity.id
		const nextAction = createDBAction({
			comment: context.components.localization.t(
				'mutation.completeEngagement.actions.markComplete'
			),
			orgId: engagement.item.org_id,
			userId: currentUserId,
			taggedUserId: currentUserId
		})

		await context.collections.engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		return {
			engagement: createGQLEngagement(engagement.item),
			message: context.components.localization.t('mutation.completeEngagement.success'),
			status: 'SUCCESS'
		}
	},
	setEngagementStatus: async (_, { body }, context) => {
		const { engId: id, status } = body
		const engagement = await context.collections.engagements.itemById(id)
		if (!engagement.item) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.setEngagementStatus.requestNotFound'),
				status: 'FAILED'
			}
		}

		// Set status
		await context.collections.engagements.updateItem({ id }, { $set: { status } })
		engagement.item.status = status

		if (status === 'CLOSED') {
			// Create action
			const currentUserId = context?.auth?.identity?.id
			if (currentUserId) {
				const nextAction = createDBAction({
					comment: context.components.localization.t(
						'mutation.setEngagementStatus.actions.markComplete'
					),
					orgId: engagement.item.org_id,
					userId: currentUserId,
					taggedUserId: currentUserId
				})

				await context.collections.engagements.updateItem({ id }, { $push: { actions: nextAction } })
				engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)
			}

			// Publish changes to websocketk connection
			await context.pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
				action: 'CLOSED',
				message: context.components.localization.t('mutation.setEngagementStatus.success'),
				engagement: createGQLEngagement(engagement.item),
				status: 'SUCCESS'
			})
		}

		return {
			engagement: createGQLEngagement(engagement.item),
			message: context.components.localization.t('mutation.setEngagementStatus.success'),
			status: 'SUCCESS'
		}
	},
	addEngagementAction: async (_, { body }, context) => {
		const { engId: id, action } = body
		if (!action.userId) {
			throw new Error(
				context.components.localization.t('mutation.addEngagementAction.userIdRequired')
			)
		}

		//  Get engagement from db
		const engagement = await context.collections.engagements.itemById(id)

		// If not found
		if (!engagement.item) {
			return {
				engagement: null,
				message: context.components.localization.t('mutation.addEngagementAction.requestNotFound'),
				status: 'FAILED'
			}
		}

		// Set actions
		const nextAction: DbAction = createDBAction(action)

		// Add a mention for the tagged user
		if (action.taggedUserId) {
			const taggedUser = await context.collections.users.itemById(action.taggedUserId)

			if (taggedUser.item) {
				const dbMention = createDBMention(
					engagement.item.id,
					context.auth.identity?.id as string,
					nextAction.date,
					action.comment
				)
				context.collections.users.updateItem(
					{ id: taggedUser.item.id },
					{ $push: { mentions: dbMention } }
				)

				// Push to subscribed user
				await context.pubsub.publish(`USER_MENTION_UPDATES_${taggedUser.item.id}`, {
					action: 'CREATED',
					message: context.components.localization.t('mutation.addEngagementAction.success'),
					mention: createGQLMention(dbMention),
					status: 'SUCCESS'
				})
			}
		}

		await context.collections.engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		return {
			engagement: createGQLEngagement(engagement.item),
			message: context.components.localization.t('mutation.addEngagementAction.success'),
			status: 'SUCCESS'
		}
	},
	forgotUserPassword: async (_, { body }, context) => {
		const { email } = body
		const user = await context.collections.users.item({ email })

		if (!user.item) {
			return {
				status: 'FAILED',
				message: context.components.localization.t('mutation.forgotUserPassword.userNotFound')
			}
		}

		if (
			!isSendMailConfigured(context.config) &&
			process.env.NODE_ENV?.toLowerCase() === 'production'
		) {
			return {
				message: context.components.localization.t(
					'mutation.forgotUserPassword.emailNotConfigured'
				),
				status: 'FAILED'
			}
		}
		//const forgotPasswordToken = context.components.authenticator.generatePassword(25, true)
		const forgotPasswordToken = context.components.authenticator.generatePasswordResetToken()

		await context.collections.users.updateItem(
			{ email: email },
			{
				$set: {
					forgot_password_token: forgotPasswordToken
				}
			}
		)

		let successMessage = context.components.localization.t('mutation.forgotUserPassword.success')
		const resetLink = `${context.components.authenticator.getRequestOrigin()}/passwordReset?email=${email}&resetToken=${forgotPasswordToken}`
		if (isSendMailConfigured(context.config)) {
			try {
				await context.components.mailer.sendMail({
					from: `${context.components.localization.t(
						'mutation.forgotUserPassword.emailHTML.header'
					)} "${context.config.defaultFromAddress}"`,
					to: user.item.email,
					subject: context.components.localization.t('mutation.forgotUserPassword.emailSubject'),
					text: context.components.localization.t('mutation.forgotUserPassword.emailBody', {
						forgotPasswordToken
					}),
					html: getForgotPasswordHTMLTemplate(resetLink, context.components.localization)
				})
			} catch (error) {
				console.error('error sending mail', error)
				return {
					status: 'FAILED',
					message: context.components.localization.t(
						'mutation.forgotUserPassword.emailNotConfigured'
					)
				}
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: password reset link: ${resetLink}`
		}

		return {
			status: 'SUCCESS',
			message: successMessage
		}
	},
	validateResetUserPasswordToken: async (_, { body }, context) => {
		const { email, resetToken } = body
		const user = await context.collections.users.item({ email })

		if (!user.item) {
			return {
				status: 'FAILED',
				message: context.components.localization.t('mutation.forgotUserPassword.userNotFound')
			}
		}

		const isValid = await context.components.authenticator.verifyPasswordResetToken(resetToken)

		if (!isValid || resetToken !== user.item.forgot_password_token) {
			await context.collections.users.updateItem(
				{ email: email },
				{ $unset: { forgot_password_token: '' } }
			)

			return {
				status: 'FAILED',
				message: context.components.localization.t(
					'mutation.forgotUserPassword.invalidTokenExpired'
				)
			}
		}

		return {
			status: 'SUCCESS',
			message: context.components.localization.t('mutation.forgotUserPassword.success')
		}
	},
	changeUserPassword: async (_, { body }, context) => {
		const { email, newPassword } = body
		const user = await context.collections.users.item({ email })

		if (!user.item) {
			return {
				status: 'FAILED',
				message: context.components.localization.t('mutation.forgotUserPassword.userNotFound')
			}
		}
		const response = await context.components.authenticator.setPassword(user.item, newPassword)

		if (!response) {
			return {
				status: 'FAILED',
				message: context.components.localization.t('mutation.forgotUserPassword.resetError')
			}
		}

		await context.collections.users.updateItem(
			{ email: email },
			{ $unset: { forgot_password_token: '' } }
		)

		return {
			status: 'SUCCESS',
			message: context.components.localization.t('mutation.forgotUserPassword.success')
		}
	},
	resetUserPassword: async (_, { body }, context) => {
		const { userId: id } = body
		const user = await context.collections.users.itemById(id)

		if (!user.item) {
			return {
				user: null,
				message: context.components.localization.t('mutation.resetUserPassword.userNotFound'),
				status: 'FAILED'
			}
		}

		// If env is production and sendmail is not configured, don't reset user password.
		if (
			!isSendMailConfigured(context.config) &&
			process.env.NODE_ENV?.toLowerCase() === 'production'
		) {
			return {
				user: null,
				message: context.components.localization.t('mutation.resetUserPassword.emailNotConfigured'),
				status: 'FAILED'
			}
		}

		const password = await context.components.authenticator.resetPassword(user.item)

		if (!password) {
			return {
				user: null,
				message: context.components.localization.t('mutation.resetUserPassword.resetError'),
				status: 'FAILED'
			}
		}

		let successMessage = context.components.localization.t('mutation.resetUserPassword.success')
		if (isSendMailConfigured(context.config)) {
			try {
				await context.components.mailer.sendMail({
					from: `${context.components.localization.t(
						'mutation.resetUserPassword.emailHTML.header'
					)} "${context.config.defaultFromAddress}"`,
					to: user.item.email,
					subject: context.components.localization.t('mutation.resetUserPassword.emailSubject'),
					text: context.components.localization.t('mutation.resetUserPassword.emailBody', {
						password
					}),
					html: getPasswordResetHTMLTemplate(password, context.components.localization)
				})
			} catch (error) {
				console.error('error sending mail', error)
				return {
					user: null,
					message: context.components.localization.t(
						'mutation.resetUserPassword.emailNotConfigured'
					),
					status: 'FAILED'
				}
			}
		} else {
			console.error('sendmail is not configured')
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return {
			user: createGQLUser(user.item),
			message: successMessage,
			status: 'SUCCESS'
		}
	},
	setUserPassword: async (_, { body }, context) => {
		const { oldPassword, newPassword } = body
		const user = context.auth.identity as DbUser

		if (!validatePassword(oldPassword, user.password)) {
			return {
				user: null,
				message: context.components.localization.t('mutation.setUserPassword.invalidPassword'),
				status: 'FAILED'
			}
		}

		const response = await context.components.authenticator.setPassword(user, newPassword)

		if (!response) {
			return {
				user: null,
				message: context.components.localization.t('mutation.setUserPassword.resetError'),
				status: 'FAILED'
			}
		}

		return {
			user: createGQLUser(user),
			message: context.components.localization.t('mutation.setUserPassword.success'),
			status: 'SUCCESS'
		}
	},
	createNewUser: async (_, { body: user }, context) => {
		const checkUser = await context.collections.users.count({
			email: user.email
		})

		if (checkUser !== 0) {
			return {
				user: null,
				message: context.components.localization.t('mutation.createNewUser.emailExist'),
				status: 'FAILED'
			}
		}

		// If env is production and sendmail is not configured, don't create user.
		if (
			!isSendMailConfigured(context.config) &&
			process.env.NODE_ENV?.toLowerCase() === 'production'
		) {
			return {
				user: null,
				message: context.components.localization.t('mutation.createNewUser.emailNotConfigured'),
				status: 'FAILED'
			}
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
			)
		])

		let successMessage = context.components.localization.t('mutation.createNewUser.success')
		if (isSendMailConfigured(context.config)) {
			try {
				await context.components.mailer.sendMail({
					from: `${context.components.localization.t('mutation.createNewUser.emailHTML.header')} "${
						context.config.defaultFromAddress
					}"`,
					to: user.email,
					subject: context.components.localization.t('mutation.createNewUser.emailSubject'),
					text: context.components.localization.t('mutation.createNewUser.emailBody', { password }),
					html: getAccountCreatedHTMLTemplate(password, context.components.localization)
				})
			} catch (error) {
				console.error('error sending mail', error)
				return {
					user: null,
					message: context.components.localization.t('mutation.createNewUser.emailNotConfigured'),
					status: 'FAILED'
				}
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return {
			user: createGQLUser(newUser),
			message: successMessage,
			status: 'SUCCESS'
		}
	},
	updateUser: async (_, { body: user }, context) => {
		if (!user.id) {
			return {
				user: null,
				message: context.components.localization.t('mutation.updateUser.userIdRequired'),
				status: 'FAILED'
			}
		}

		const result = await context.collections.users.itemById(user.id)

		if (!result.item) {
			return {
				user: null,
				message: context.components.localization.t('mutation.updateUser.userNotFound'),
				status: 'FAILED'
			}
		}
		const dbUser = result.item

		if (dbUser.email !== user.email) {
			const emailCheck = await context.collections.users.count({
				email: user.email
			})

			if (emailCheck !== 0) {
				return {
					user: null,
					message: context.components.localization.t('mutation.updateUser.emailExist'),
					status: 'FAILED'
				}
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
			message: context.components.localization.t('mutation.updateUser.success'),
			status: 'SUCCESS'
		}
	},
	updateUserFCMToken: async (_, { body: user }, context) => {
		if (!user.fcmToken)
			return {
				message: context.components.localization.t('mutation.updateUser.failed'),
				status: 'FAILED'
			}

		// TODO: tokenize and expire fcm tokens
		try {
			await context.collections.users.updateItem(
				{ id: context.auth.identity?.id },
				{
					$set: {
						fcm_token: user.fcmToken
					}
				}
			)
		} catch (error) {
			console.error('error updating token', error)
			if (!user.fcmToken)
				return {
					message: context.components.localization.t('mutation.updateUser.failed'),
					status: 'FAILED'
				}
		}

		return {
			message: context.components.localization.t('mutation.updateUser.success'),
			status: 'SUCCESS'
		}
	},
	markMentionSeen: async (_, { body }, context) => {
		const { userId, engId: engagementId, markAll, createdAt } = body
		const result = await context.collections.users.itemById(userId)

		if (!result.item) {
			return {
				user: null,
				message: context.components.localization.t('mutation.markMentionSeen.userNotFound'),
				status: 'FAILED'
			}
		}

		const dbUser = result.item

		dbUser.mentions?.forEach((mention: DbMention) => {
			if (!!markAll) {
				mention.seen = true
			} else if (mention.engagement_id === engagementId && mention.created_at === createdAt) {
				mention.seen = true
			}
		})

		await context.collections.users.saveItem(dbUser)

		return {
			user: createGQLUser(dbUser),
			message: context.components.localization.t('mutation.markMentionSeen.success'),
			status: 'SUCCESS'
		}
	},
	markMentionDismissed: async (_, { body }, context) => {
		const { userId, engId: engagementId, dismissAll, createdAt } = body
		const result = await context.collections.users.itemById(userId)

		if (!result.item) {
			return {
				user: null,
				message: context.components.localization.t('mutation.markMentionDismissed.userNotFound'),
				status: 'FAILED'
			}
		}

		const dbUser = result.item

		dbUser.mentions?.forEach((mention: DbMention) => {
			if (!!dismissAll) {
				mention.dismissed = true
			} else if (mention.engagement_id === engagementId && mention.created_at === createdAt) {
				mention.dismissed = true
			}
		})

		await context.collections.users.saveItem(dbUser)

		return {
			user: createGQLUser(dbUser),
			message: context.components.localization.t('mutation.markMentionDismissed.success'),
			status: 'SUCCESS'
		}
	},
	createNewTag: async (_, { body }, context) => {
		const { orgId, tag } = body
		if (!orgId) {
			return {
				tag: null,
				message: context.components.localization.t('mutation.createNewTag.orgIdRequired'),
				status: 'FAILED'
			}
		}
		const newTag = createDBTag(tag, orgId)

		try {
			await context.collections.tags.insertItem(newTag)
		} catch (err) {
			throw err
		}

		try {
			await context.collections.orgs.updateItem({ id: orgId }, { $push: { tags: newTag.id } })
		} catch (err) {
			throw err
		}

		return {
			tag: newTag,
			message: context.components.localization.t('mutation.createNewTag.success'),
			status: 'SUCCESS'
		}
	},
	updateTag: async (_, { body }, context) => {
		const { tag } = body
		if (!tag.id) {
			return {
				tag: null,
				message: context.components.localization.t('mutation.updateTag.tagIdRequired'),
				status: 'FAILED'
			}
		}

		// Update the tag
		try {
			await context.collections.tags.updateItem(
				{ id: tag.id },
				{
					$set: {
						label: tag.label,
						description: tag.description,
						category: tag.category
					}
				}
			)
		} catch (error) {
			console.log('Failed to update tag', error)
		}

		// Get the updated tag from the database
		const { item: updatedTag } = await context.collections.tags.itemById(tag.id)

		return {
			tag: createGQLTag(updatedTag),
			message: context.components.localization.t('mutation.updateTag.success'),
			status: 'SUCCESS'
		}
	},
	createContact: async (_, { body: contact }, context) => {
		if (!contact.orgId) {
			return {
				contact: null,
				message: context.components.localization.t('mutation.createContact.orgIdRequired'),
				status: 'FAILED'
			}
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
			message: context.components.localization.t('mutation.createContact.success'),
			status: 'SUCCESS'
		}
	},
	updateContact: async (_, { body: contact }, context) => {
		if (!contact.id) {
			return {
				contact: null,
				message: context.components.localization.t('mutation.updateContact.contactIdRequired'),
				status: 'FAILED'
			}
		}

		if (!contact.orgId) {
			return {
				contact: null,
				message: context.components.localization.t('mutation.updateContact.orgIdRequired'),
				status: 'FAILED'
			}
		}

		const result = await context.collections.contacts.itemById(contact.id)
		if (!result.item) {
			return {
				contact: null,
				message: context.components.localization.t('mutation.updateContact.userNotFound'),
				status: 'FAILED'
			}
		}
		const dbContact = result.item

		const changedData: DbContact = {
			...dbContact,
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
				: undefined,
			attributes: contact?.attributes || undefined
		}

		await context.collections.contacts.updateItem(
			{ id: dbContact.id },
			{
				$set: changedData
			}
		)

		const offset = context.config.defaultPageOffset
		const limit = context.config.defaultPageLimit

		const engagements = await context.collections.engagements.items(
			{ offset, limit },
			{
				contacts: dbContact.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))

		const orgData = await context.collections.orgs.itemById(contact.orgId)
		const attributes: Attribute[] = []
		changedData.attributes?.forEach((attrId) => {
			const attr = orgData.item?.attributes?.find((a) => a.id === attrId)
			if (attr) {
				attributes.push(createGQLAttribute(attr))
			}
		})

		return {
			contact: createGQLContact(changedData, eng, attributes),
			message: context.components.localization.t('mutation.updateContact.success'),
			status: 'SUCCESS'
		}
	},
	createAttribute: async (_, { body: attribute }, context) => {
		const newAttribute = createDBAttribute(attribute)
		if (!attribute.orgId) {
			return {
				tag: null,
				message: context.components.localization.t('mutation.createAttribute.orgIdRequired'),
				status: 'FAILED'
			}
		}

		await context.collections.orgs.updateItem(
			{ id: attribute.orgId },
			{ $push: { attributes: newAttribute } }
		)

		return {
			attribute: newAttribute,
			message: context.components.localization.t('mutation.createAttribute.success'),
			status: 'SUCCESS'
		}
	},
	updateAttribute: async (_, { body: attribute }, context) => {
		if (!attribute.id) {
			return {
				attribute: null,
				message: context.components.localization.t('mutation.updateAttribute.attributeIdRequired'),
				status: 'FAILED'
			}
		}

		if (!attribute.orgId) {
			return {
				attribute: null,
				message: context.components.localization.t('mutation.updateAttribute.orgIdRequired'),
				status: 'FAILED'
			}
		}

		await context.collections.orgs.updateItem(
			{ id: attribute.orgId, 'attributes.id': attribute.id },
			{
				$set: {
					'attributes.$.label': attribute.label,
					'attributes.$.description': attribute.description
				}
			}
		)

		return {
			attribute: {
				id: attribute.id || '',
				label: attribute.label || '',
				description: attribute.description || ''
			},
			message: context.components.localization.t('mutation.updateAttribute.success'),
			status: 'SUCCESS'
		}
	},
	createService: async (_, { body: service }, context) => {
		const newService = createDBService(service)
		if (!service.orgId) {
			return {
				service: null,
				message: context.components.localization.t('mutation.createService.orgIdRequired'),
				status: 'FAILED'
			}
		}

		await context.collections.services.insertItem(newService)

		return {
			service: createGQLService(newService),
			message: context.components.localization.t('mutation.createService.success'),
			status: 'SUCCESS'
		}
	},
	updateService: async (_, { body: service }, context) => {
		if (!service.serviceId) {
			return {
				service: null,
				message: context.components.localization.t('mutation.updateService.serviceIdRequired'),
				status: 'FAILED'
			}
		}

		if (!service.orgId) {
			return {
				service: null,
				message: context.components.localization.t('mutation.updateService.orgIdRequired'),
				status: 'FAILED'
			}
		}

		const result = await context.collections.services.itemById(service.serviceId)
		if (!result.item) {
			return {
				contact: null,
				message: context.components.localization.t('mutation.updateService.serviceNotFound'),
				status: 'FAILED'
			}
		}

		const dbService = result.item

		const changedData = {
			...dbService,
			name: service.name || dbService.name,
			description: service.description || dbService.description,
			tags: service.tags || dbService.tags,
			customFields: service.customFields || dbService.customFields,
			contactFormEnabled: service.contactFormEnabled,
			contacts: service.contacts || dbService.contacts
		}

		await context.collections.services.updateItem({ id: service.serviceId }, { $set: changedData })

		return {
			service: createGQLService(changedData),
			message: context.components.localization.t('mutation.updateService.success'),
			status: 'SUCCESS'
		}
	}
}
