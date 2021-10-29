/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementCountsResolvers, EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { container } from 'tsyringe'
import { EngagementCollection } from '~db/EngagementCollection'
import { RequestContext } from '~types'

export const EngagementCounts: EngagementCountsResolvers<RequestContext> = {
	active: (_) => {
		const engagements = container.resolve(EngagementCollection)
		const user_id = (_ as any).user_id
		return engagements.count({
			user_id: user_id,
			status: { $ne: EngagementStatus.Closed }
		})
	},
	closed: (_) => {
		const engagements = container.resolve(EngagementCollection)
		const user_id = (_ as any).user_id
		return engagements.count({
			user_id: user_id,
			status: { $eq: EngagementStatus.Closed }
		})
	}
}
