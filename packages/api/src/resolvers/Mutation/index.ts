/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Mutation: MutationResolvers<AppContext> = {
	authenticate: (_, { body }, { interactors: { authenticate } }) => authenticate.execute(body),

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

	forgotUserPassword: async (_, { body }, { interactors: { forgotUserPassword } }) =>
		forgotUserPassword.execute(body),

	validateResetUserPasswordToken: async (
		_,
		{ body },
		{ interactors: { validateResetUserPasswordToken } }
	) => validateResetUserPasswordToken.execute(body),

	changeUserPassword: async (_, { body }, { interactors: { changeUserPassword } }) =>
		changeUserPassword.execute(body),

	resetUserPassword: async (_, { body }, { interactors: { resetUserPassword } }) =>
		resetUserPassword.execute(body),

	setUserPassword: async (_, { body }, { auth, interactors: { setUserPassword } }) =>
		setUserPassword.execute(body, auth.identity),

	createNewUser: async (_, { body }, { interactors: { createNewUser } }) =>
		createNewUser.execute(body),

	updateUser: async (_, { body }, { interactors: { updateUser } }) => updateUser.execute(body),

	updateUserFCMToken: async (_, { body }, { auth, interactors: { updateUserFCMToken } }) =>
		updateUserFCMToken.execute(body, auth.identity),

	markMentionSeen: async (_, { body }, { interactors: { markMentionSeen } }) =>
		markMentionSeen.execute(body),

	markMentionDismissed: async (_, { body }, { interactors: { markMentionDismissed } }) =>
		markMentionDismissed.execute(body),

	createNewTag: async (_, { body }, { interactors: { createNewTag } }) =>
		createNewTag.execute(body),

	updateTag: async (_, { body }, { interactors: { updateTag } }) => updateTag.execute(body),

	createContact: async (_, { body }, { interactors: { createContact } }) =>
		createContact.execute(body),

	updateContact: async (_, { body }, { interactors: { updateContact } }) =>
		updateContact.execute(body),

	createAttribute: async (_, { body }, { interactors: { createAttribute } }) =>
		createAttribute.execute(body),

	updateAttribute: async (_, { body }, { interactors: { updateAttribute } }) =>
		updateAttribute.execute(body),

	createService: async (_, { body }, { interactors: { createService } }) =>
		createService.execute(body),

	updateService: async (_, { body }, { interactors: { updateService } }) =>
		updateService.execute(body)
}
