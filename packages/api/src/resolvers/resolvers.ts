/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { AppContext } from '~types'
import { EngagementResponse, MentionEvent, Resolvers } from '@cbosuite/schema/dist/provider-types'
import * as primitives from './primitives'
import { types } from './types'

export const resolvers: Resolvers<AppContext> & IResolvers<any, AppContext> = {
	...primitives,
	...types,
	Query: {
		organizations: async (_, args, { requestCtx, interactors: { getOrganizations } }) =>
			getOrganizations.execute(args, requestCtx),

		organization: async (_, args, { requestCtx, interactors: { getOrganization } }) =>
			getOrganization.execute(args, requestCtx),

		user: async (_, args, { requestCtx, interactors: { getUser } }) =>
			getUser.execute(args, requestCtx),

		contact: async (_, args, { requestCtx, interactors: { getContact } }) =>
			getContact.execute(args, requestCtx),

		contacts: async (_, args, { requestCtx, interactors: { getContacts } }) =>
			getContacts.execute(args, requestCtx),

		engagement: async (_, args, { requestCtx, interactors: { getEngagement } }) =>
			getEngagement.execute(args, requestCtx),

		activeEngagements: async (_, args, { requestCtx, interactors: { getActiveEngagements } }) =>
			getActiveEngagements.execute(args, requestCtx),

		inactiveEngagements: async (_, args, { requestCtx, interactors: { getInactiveEngagements } }) =>
			getInactiveEngagements.execute(args, requestCtx),

		exportData: async (_, args, { requestCtx, interactors: { exportData } }) =>
			exportData.execute(args, requestCtx),

		services: async (_, args, ctx) => ctx.interactors.getServices.execute(args, ctx.requestCtx),

		serviceAnswers: async (_, args, { requestCtx, interactors: { getServiceAnswers } }) =>
			getServiceAnswers.execute(args, requestCtx)
	},
	Mutation: {
		authenticate: (_, args, { requestCtx, interactors: { authenticate } }) =>
			authenticate.execute(args, requestCtx),

		createEngagement: (_, args, { requestCtx, interactors: { createEngagement } }) =>
			createEngagement.execute(args, requestCtx),

		updateEngagement: async (_, args, { requestCtx, interactors: { updateEngagement } }) =>
			updateEngagement.execute(args, requestCtx),

		assignEngagement: async (_, args, { requestCtx, interactors: { assignEngagement } }) =>
			assignEngagement.execute(args, requestCtx),

		completeEngagement: async (_, args, { requestCtx, interactors: { completeEngagement } }) =>
			completeEngagement.execute(args, requestCtx),

		setEngagementStatus: async (_, args, { requestCtx, interactors: { setEngagementStatus } }) =>
			setEngagementStatus.execute(args, requestCtx),

		addEngagementAction: async (_, args, { requestCtx, interactors: { addEngagementAction } }) =>
			addEngagementAction.execute(args, requestCtx),

		initiatePasswordReset: async (
			_,
			args,
			{ requestCtx, interactors: { initiatePasswordReset } }
		) => initiatePasswordReset.execute(args, requestCtx),

		executePasswordReset: async (_, args, { requestCtx, interactors: { executePasswordReset } }) =>
			executePasswordReset.execute(args, requestCtx),

		resetUserPassword: async (_, args, { requestCtx, interactors: { resetUserPassword } }) =>
			resetUserPassword.execute(args, requestCtx),

		setUserPassword: async (_, args, { requestCtx, interactors: { setUserPassword } }) =>
			setUserPassword.execute(args, requestCtx),

		createNewUser: async (_, args, { requestCtx, interactors: { createNewUser } }) =>
			createNewUser.execute(args, requestCtx),

		updateUser: async (_, args, { requestCtx, interactors: { updateUser } }) =>
			updateUser.execute(args, requestCtx),

		removeUserFromOrganization: async (
			_,
			args,
			{ requestCtx, interactors: { removeUserFromOrganization } }
		) => removeUserFromOrganization.execute(args, requestCtx),

		updateUserFCMToken: async (_, args, { requestCtx, interactors: { updateUserFCMToken } }) =>
			updateUserFCMToken.execute(args, requestCtx),

		markMentionSeen: async (_, args, { requestCtx, interactors: { markMentionSeen } }) =>
			markMentionSeen.execute(args, requestCtx),

		markMentionDismissed: async (_, args, { requestCtx, interactors: { markMentionDismissed } }) =>
			markMentionDismissed.execute(args, requestCtx),

		createNewTag: async (_, args, { requestCtx, interactors: { createNewTag } }) =>
			createNewTag.execute(args, requestCtx),

		updateTag: async (_, args, { requestCtx, interactors: { updateTag } }) =>
			updateTag.execute(args, requestCtx),

		createContact: async (_, args, { requestCtx, interactors: { createContact } }) =>
			createContact.execute(args, requestCtx),

		updateContact: async (_, args, { requestCtx, interactors: { updateContact } }) =>
			updateContact.execute(args, requestCtx),

		archiveContact: async (_, args, { requestCtx, interactors: { archiveContact } }) =>
			archiveContact.execute(args, requestCtx),

		createService: async (_, args, { requestCtx, interactors: { createService } }) =>
			createService.execute(args, requestCtx),

		updateService: async (_, args, { requestCtx, interactors: { updateService } }) =>
			updateService.execute(args, requestCtx),

		createServiceAnswer: async (_, args, { requestCtx, interactors: { createServiceAnswer } }) =>
			createServiceAnswer.execute(args, requestCtx),

		deleteServiceAnswer: async (_, args, { requestCtx, interactors: { deleteServiceAnswer } }) =>
			deleteServiceAnswer.execute(args, requestCtx),

		updateServiceAnswer: async (_, args, { requestCtx, interactors: { updateServiceAnswer } }) =>
			updateServiceAnswer.execute(args, requestCtx)
	},
	Subscription: {
		mentions: {
			subscribe: (_, { userId }, { components: { publisher } }) =>
				publisher.subscribeToMentions(userId),
			resolve: (payload: MentionEvent) => payload
		},
		engagements: {
			subscribe: (_, { orgId }, { components: { publisher } }) =>
				publisher.subscribeToEngagements(orgId),
			resolve: (payload: EngagementResponse) => payload
		}
	}
}
