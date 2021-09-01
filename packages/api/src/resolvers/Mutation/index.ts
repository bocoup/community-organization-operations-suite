/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Mutation: MutationResolvers<AppContext> = {
	authenticate: (_, { body }, { auth, interactors: { authenticate } }) =>
		authenticate.execute(body, auth.identity),

	createEngagement: (_, { body }, { auth, interactors: { createEngagement } }) =>
		createEngagement.execute(body, auth.identity),

	updateEngagement: async (_, { body }, { auth, interactors: { updateEngagement } }) =>
		updateEngagement.execute(body, auth.identity),

	assignEngagement: async (_, { body }, { auth, interactors: { assignEngagement } }) =>
		assignEngagement.execute(body, auth.identity),

	completeEngagement: async (_, { body }, { auth, interactors: { completeEngagement } }) =>
		completeEngagement.execute(body, auth.identity),

	setEngagementStatus: async (_, { body }, { auth, interactors: { setEngagementStatus } }) =>
		setEngagementStatus.execute(body, auth.identity),

	addEngagementAction: async (_, { body }, { auth, interactors: { addEngagement } }) =>
		addEngagement.execute(body, auth.identity),

	forgotUserPassword: async (_, { body }, { auth, interactors: { forgotUserPassword } }) =>
		forgotUserPassword.execute(body, auth.identity),

	validateResetUserPasswordToken: async (
		_,
		{ body },
		{ auth, interactors: { validateResetUserPasswordToken } }
	) => validateResetUserPasswordToken.execute(body, auth.identity),

	changeUserPassword: async (_, { body }, { auth, interactors: { changeUserPassword } }) =>
		changeUserPassword.execute(body, auth.identity),

	resetUserPassword: async (_, { body }, { auth, interactors: { resetUserPassword } }) =>
		resetUserPassword.execute(body, auth.identity),

	setUserPassword: async (_, { body }, { auth, interactors: { setUserPassword } }) =>
		setUserPassword.execute(body, auth.identity),

	createNewUser: async (_, { body }, { auth, interactors: { createNewUser } }) =>
		createNewUser.execute(body, auth.identity),

	updateUser: async (_, { body }, { auth, interactors: { updateUser } }) =>
		updateUser.execute(body, auth.identity),

	updateUserFCMToken: async (_, { body }, { auth, interactors: { updateUserFCMToken } }) =>
		updateUserFCMToken.execute(body, auth.identity),

	markMentionSeen: async (_, { body }, { auth, interactors: { markMentionSeen } }) =>
		markMentionSeen.execute(body, auth.identity),

	markMentionDismissed: async (_, { body }, { auth, interactors: { markMentionDismissed } }) =>
		markMentionDismissed.execute(body, auth.identity),

	createNewTag: async (_, { body }, { auth, interactors: { createNewTag } }) =>
		createNewTag.execute(body, auth.identity),

	updateTag: async (_, { body }, { auth, interactors: { updateTag } }) =>
		updateTag.execute(body, auth.identity),

	createContact: async (_, { body }, { auth, interactors: { createContact } }) =>
		createContact.execute(body, auth.identity),

	updateContact: async (_, { body }, { auth, interactors: { updateContact } }) =>
		updateContact.execute(body, auth.identity),

	createAttribute: async (_, { body }, { auth, interactors: { createAttribute } }) =>
		createAttribute.execute(body, auth.identity),

	updateAttribute: async (_, { body }, { auth, interactors: { updateAttribute } }) =>
		updateAttribute.execute(body, auth.identity),

	createService: async (_, { body }, { auth, interactors: { createService } }) =>
		createService.execute(body, auth.identity),

	updateService: async (_, { body }, { auth, interactors: { updateService } }) =>
		updateService.execute(body, auth.identity)
}
