/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Query: QueryResolvers<AppContext> = {
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
}
