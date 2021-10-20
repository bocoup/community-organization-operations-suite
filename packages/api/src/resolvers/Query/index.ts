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

	contacts: async (_, { body }, ctx) => ctx.interactors.getContacts.execute(body, ctx.requestCtx),

	engagement: async (_, { body }, ctx) =>
		ctx.interactors.getEngagement.execute(body, ctx.requestCtx),

	activeEngagements: async (_, { body }, ctx) =>
		ctx.interactors.getActiveEngagements.execute(body, ctx.requestCtx),

	inactiveEngagements: async (_, { body }, ctx) =>
		ctx.interactors.getInactiveEngagements.execute(body, ctx.requestCtx),

	exportData: async (_, args, ctx) => ctx.interactors.exportData.execute(args, ctx.requestCtx),

	services: async (_, args, ctx) => ctx.interactors.getServices.execute(args, ctx.requestCtx),

	serviceAnswers: async (_, { body }, ctx) =>
		ctx.interactors.getServiceAnswers.execute(body, ctx.requestCtx)
}
