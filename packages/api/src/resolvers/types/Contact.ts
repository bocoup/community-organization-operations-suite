/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact as ContactType, ContactResolvers } from '@greenlight/schema/lib/provider-types'
import { AppContext } from '~types'
import { createGQLEngagement } from '~dto'

export const Contact: ContactResolvers<AppContext> = {
	engagements: async (_: ContactType, args, context) => {
		const engagements = await context.collections.engagements.items(
			{},
			{
				contact_id: _.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))
		return eng
	}
}
