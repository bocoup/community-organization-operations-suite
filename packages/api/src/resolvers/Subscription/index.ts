/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EngagementResponse,
	MentionSubscriptionResponse,
	SubscriptionResolvers
} from '@cbosuite/schema/lib/provider-types'
import { AppContext } from '~types'

export const Subscription: SubscriptionResolvers<AppContext> = {
	subscribeToMentions: {
		subscribe: async (_, { body }, { pubsub }) =>
			await pubsub.asyncIterator(`USER_MENTION_UPDATES_${body.userId}`),
		resolve: (payload: MentionSubscriptionResponse) => {
			return payload
		}
	},
	engagementUpdate: {
		subscribe: async (_, { body }, { pubsub }) =>
			await pubsub.asyncIterator(`ORG_ENGAGEMENT_UPDATES_${body.orgId}`),
		resolve: (payload: EngagementResponse) => {
			return payload
		}
	}
}
