/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EngagementResponse,
	MentionSubscriptionResponse,
	SubscriptionResolvers
} from '@resolve/schema/lib/provider-types'
import { AppContext } from '~types'

export const Subscription: SubscriptionResolvers<AppContext> = {
	subscribeToMentions: {
		subscribe: async (_, { userId }, { pubsub }) =>
			await pubsub.asyncIterator(`USER_MENTION_UPDATES_${userId}`),
		resolve: (payload: MentionSubscriptionResponse) => {
			return payload
		}
	},
	engagementUpdate: {
		subscribe: async (_, { orgId }, { pubsub }) =>
			await pubsub.asyncIterator(`ORG_ENGAGEMENT_UPDATES_${orgId}`),
		resolve: (payload: EngagementResponse) => {
			return payload
		}
	}
}
