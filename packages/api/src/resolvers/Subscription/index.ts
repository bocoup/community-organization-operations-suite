/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { EngagementResponse, SubscriptionResolvers } from '@greenlight/schema/lib/provider-types'
import { AppContext } from '~types'

export const Subscription: SubscriptionResolvers<AppContext> = {
	engagementUpdate: {
		subscribe: async (root, { orgId }, { pubsub }) =>
			await pubsub.asyncIterator(`ORG_ENGAGEMENT_UPDATES_${orgId}`),
		resolve: (payload: EngagementResponse) => {
			return payload
		}
	}
}
