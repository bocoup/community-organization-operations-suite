/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Query: QueryResolvers<AppContext> = {
	organizations: async (_, args, ctx) =>
		ctx.interactors.getOrganizations.execute(args, ctx.requestCtx),

	organization: async (_, args, ctx) =>
		ctx.interactors.getOrganization.execute(args, ctx.requestCtx),

	user: async (_, args, ctx) => ctx.interactors.getUser.execute(args, ctx.requestCtx),

	contact: async (_, args, ctx) => ctx.interactors.getContact.execute(args, ctx.requestCtx),

	contacts: async (_, args, ctx) => ctx.interactors.getContacts.execute(args, ctx.requestCtx),

	engagement: async (_, args, ctx) => ctx.interactors.getEngagement.execute(args, ctx.requestCtx),

	activeEngagements: async (_, args, ctx) =>
		ctx.interactors.getActiveEngagements.execute(args, ctx.requestCtx),

	inactiveEngagements: async (_, args, ctx) =>
		ctx.interactors.getInactiveEngagements.execute(args, ctx.requestCtx),

	exportData: async (_, args, ctx) => ctx.interactors.exportData.execute(args, ctx.requestCtx),

	services: async (_, args, ctx) => ctx.interactors.getServices.execute(args, ctx.requestCtx),

	serviceAnswers: async (_, args, ctx) =>
		ctx.interactors.getServiceAnswers.execute(args, ctx.requestCtx)
}
