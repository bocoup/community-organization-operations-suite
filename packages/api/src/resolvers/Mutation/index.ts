/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Mutation: MutationResolvers<AppContext> = {
	authenticate: (_, { body }, { requestCtx, interactors: { authenticate } }) =>
		authenticate.execute(body, requestCtx),

	createEngagement: (_, { body }, { requestCtx, interactors: { createEngagement } }) =>
		createEngagement.execute(body, requestCtx),

	updateEngagement: async (_, { body }, { requestCtx, interactors: { updateEngagement } }) =>
		updateEngagement.execute(body, requestCtx),

	assignEngagement: async (_, { body }, { requestCtx, interactors: { assignEngagement } }) =>
		assignEngagement.execute(body, requestCtx),

	completeEngagement: async (_, { body }, { requestCtx, interactors: { completeEngagement } }) =>
		completeEngagement.execute(body, requestCtx),

	setEngagementStatus: async (_, { body }, { requestCtx, interactors: { setEngagementStatus } }) =>
		setEngagementStatus.execute(body, requestCtx),

	addEngagementAction: async (_, { body }, { requestCtx, interactors: { addEngagement } }) =>
		addEngagement.execute(body, requestCtx),

	forgotUserPassword: async (_, { body }, { requestCtx, interactors: { forgotUserPassword } }) =>
		forgotUserPassword.execute(body, requestCtx),

	validateResetUserPasswordToken: async (
		_,
		{ body },
		{ requestCtx, interactors: { validateResetUserPasswordToken } }
	) => validateResetUserPasswordToken.execute(body, requestCtx),

	changeUserPassword: async (_, { body }, { requestCtx, interactors: { changeUserPassword } }) =>
		changeUserPassword.execute(body, requestCtx),

	resetUserPassword: async (_, args, { requestCtx, interactors: { resetUserPassword } }) =>
		resetUserPassword.execute(args, requestCtx),

	setUserPassword: async (_, { body }, { requestCtx, interactors: { setUserPassword } }) =>
		setUserPassword.execute(body, requestCtx),

	createNewUser: async (_, { body }, { requestCtx, interactors: { createNewUser } }) =>
		createNewUser.execute(body, requestCtx),

	updateUser: async (_, { body }, { requestCtx, interactors: { updateUser } }) =>
		updateUser.execute(body, requestCtx),

	deleteUser: async (_, args, { requestCtx, interactors: { deleteUser } }) =>
		deleteUser.execute(args, requestCtx),

	updateUserFCMToken: async (_, { body }, { requestCtx, interactors: { updateUserFCMToken } }) =>
		updateUserFCMToken.execute(body, requestCtx),

	markMentionSeen: async (_, { body }, { requestCtx, interactors: { markMentionSeen } }) =>
		markMentionSeen.execute(body, requestCtx),

	markMentionDismissed: async (
		_,
		{ body },
		{ requestCtx, interactors: { markMentionDismissed } }
	) => markMentionDismissed.execute(body, requestCtx),

	createNewTag: async (_, { body }, { requestCtx, interactors: { createNewTag } }) =>
		createNewTag.execute(body, requestCtx),

	updateTag: async (_, { body }, { requestCtx, interactors: { updateTag } }) =>
		updateTag.execute(body, requestCtx),

	createContact: async (_, { body }, { requestCtx, interactors: { createContact } }) =>
		createContact.execute(body, requestCtx),

	updateContact: async (_, { body }, { requestCtx, interactors: { updateContact } }) =>
		updateContact.execute(body, requestCtx),

	archiveContact: async (_, { body }, { requestCtx, interactors: { archiveContact } }) =>
		archiveContact.execute(body, requestCtx),

	createService: async (_, { body }, { requestCtx, interactors: { createService } }) =>
		createService.execute(body, requestCtx),

	updateService: async (_, { body }, { requestCtx, interactors: { updateService } }) =>
		updateService.execute(body, requestCtx),

	createServiceAnswers: async (
		_,
		{ body },
		{ requestCtx, interactors: { createServiceAnswers } }
	) => createServiceAnswers.execute(body, requestCtx),

	deleteServiceAnswer: async (_, { body }, { requestCtx, interactors: { deleteServiceAnswer } }) =>
		deleteServiceAnswer.execute(body, requestCtx),

	updateServiceAnswer: async (_, { body }, { requestCtx, interactors: { updateServiceAnswer } }) =>
		updateServiceAnswer.execute(body, requestCtx)
}
