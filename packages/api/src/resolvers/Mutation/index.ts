/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Mutation: MutationResolvers<AppContext> = {
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

	forgotUserPassword: async (_, args, { requestCtx, interactors: { forgotUserPassword } }) =>
		forgotUserPassword.execute(args, requestCtx),

	validateResetUserPasswordToken: async (
		_,
		args,
		{ requestCtx, interactors: { validateResetUserPasswordToken } }
	) => validateResetUserPasswordToken.execute(args, requestCtx),

	changeUserPassword: async (_, args, { requestCtx, interactors: { changeUserPassword } }) =>
		changeUserPassword.execute(args, requestCtx),

	resetUserPassword: async (_, args, { requestCtx, interactors: { resetUserPassword } }) =>
		resetUserPassword.execute(args, requestCtx),

	setUserPassword: async (_, args, { requestCtx, interactors: { setUserPassword } }) =>
		setUserPassword.execute(args, requestCtx),

	createNewUser: async (_, args, { requestCtx, interactors: { createNewUser } }) =>
		createNewUser.execute(args, requestCtx),

	updateUser: async (_, args, { requestCtx, interactors: { updateUser } }) =>
		updateUser.execute(args, requestCtx),

	deleteUser: async (_, args, { requestCtx, interactors: { deleteUser } }) =>
		deleteUser.execute(args, requestCtx),

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
}
