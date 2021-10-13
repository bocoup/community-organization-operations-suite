/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementCountsResolvers, EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { AppContext } from '~types'

export const EngagementCounts: EngagementCountsResolvers<AppContext> = {
	active: (_, args, context) => {
		const user_id = (_ as any).user_id
		return context.collections.engagements.count({
			user_id: user_id,
			status: { $ne: EngagementStatus.Closed }
		})
	},
	closed: (_, args, context) => {
		const user_id = (_ as any).user_id
		return context.collections.engagements.count({
			user_id: user_id,
			status: { $eq: EngagementStatus.Closed }
		})
	}
}
