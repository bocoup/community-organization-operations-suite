/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Mention as MentionType,
	MentionResolvers
} from '@community-organization-operations-suite/schema/lib/provider-types'
import { createGQLEngagement, createGQLUser } from '~dto'
import { AppContext } from '~types'

export const Mention: MentionResolvers<AppContext> = {
	engagement: async (_: MentionType, args, context) => {
		if (!_.engagement) return null

		if (_.engagement.id) {
			return _.engagement
		}

		const engagementId = _.engagement as any as string
		const engagement = await context.collections.engagements.itemById(engagementId)
		if (!engagement.item) {
			throw new Error('engagement not found for notification')
		}

		return createGQLEngagement(engagement.item)
	},
	createdBy: async (_: MentionType, args, context) => {
		if (!_.createdBy) return null

		if (_.createdBy.id) {
			return _.createdBy
		}

		const userId = _.createdBy as any as string
		const user = await context.collections.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for notification')
		}

		return createGQLUser(user.item)
	}
}
