/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const Query: QueryResolvers<AppContext> = {
	organizations: async (_, { body }, ctx) =>
		ctx.interactors.getOrganizations.execute(body, ctx.requestCtx),

	organization: async (_, { body }, ctx) =>
		ctx.interactors.getOrganization.execute(body, ctx.requestCtx),

	user: async (_, { body }, ctx) => ctx.interactors.getUser.execute(body, ctx.requestCtx),

	contact: async (_, { body }, ctx) => ctx.interactors.getContact.execute(body, ctx.requestCtx),

	contacts: async (_, { body }, ctx) => ctx.interactors.getContacts.execute(body, ctx.requestCtx),

	engagement: async (_, { body }, ctx) =>
		ctx.interactors.getEngagement.execute(body, ctx.requestCtx),

	activeEngagements: async (_, { body }, ctx) =>
		ctx.interactors.getActiveEngagements.execute(body, ctx.requestCtx),

	inactiveEngagements: async (_, { body }, ctx) =>
		ctx.interactors.getInactiveEngagements.execute(body, ctx.requestCtx),

	exportData: async (_, { body }, ctx) => ctx.interactors.exportData.execute(body, ctx.requestCtx),

	services: async (_, { body }, ctx) => ctx.interactors.getServices.execute(body, ctx.requestCtx),

	serviceAnswers: async (_, { body }, ctx) =>
		ctx.interactors.getServiceAnswers.execute(body, ctx.requestCtx)
}
