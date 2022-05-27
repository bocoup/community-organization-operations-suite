/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Engagement,
	QueryActiveEngagementsArgs,
	EngagementStatus
} from '@cbosuite/schema/dist/provider-types'
import { Condition, FilterQuery } from 'mongodb'
import { Configuration } from '~components/Configuration'
import { EngagementCollection } from '~db/EngagementCollection'
import { DbEngagement } from '~db/types'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

export abstract class GetEngagementsInteractorBase
	implements Interactor<unknown, QueryActiveEngagementsArgs, Engagement[]>
{
	protected abstract engagements: EngagementCollection
	protected abstract config: Configuration
	protected abstract status: Condition<EngagementStatus>
	protected abstract sortBy(a: DbEngagement, b: DbEngagement): number

	public async execute(
		_: unknown,
		{ orgId, userId, offset, limit }: QueryActiveEngagementsArgs,
		ctx: RequestContext
	): Promise<Engagement[]> {
		offset = offset ?? this.config.defaultPageOffset
		limit = limit ?? this.config.defaultPageLimit

		// out-of-org users should not see org engagements
		if (!ctx.identity?.roles.some((r) => r.org_id === orgId)) {
			return empty
		}

		const filter: FilterQuery<DbEngagement> = {
			org_id: orgId,
			status: { $nin: [EngagementStatus.Closed, EngagementStatus.Completed] }
		}

		if (userId) {
			filter.user_id = { $ne: userId as string }
		}

		const result = await this.engagements.items({ offset, limit }, filter)

		return result.items.sort(this.sortBy).map(createGQLEngagement)
	}
}
