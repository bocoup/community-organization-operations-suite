/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement, QueryActiveEngagementsArgs } from '@cbosuite/schema/dist/provider-types'
import { EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import type { Condition } from 'mongodb'
import type { Configuration } from '~components/Configuration'
import type { EngagementCollection } from '~db/EngagementCollection'
import type { DbEngagement } from '~db/types'
import { createGQLEngagement } from '~dto'
import type { Interactor, RequestContext } from '~types'
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
		{ orgId, offset, limit }: QueryActiveEngagementsArgs,
		ctx: RequestContext
	): Promise<Engagement[]> {
		offset = offset ?? this.config.defaultPageOffset
		limit = limit ?? this.config.defaultPageLimit

		// out-of-org users should not see org engagements
		if (!ctx.identity?.roles.some((r) => r.org_id === orgId)) {
			return empty
		}

		const result = await this.engagements.items(
			{ offset, limit },
			{
				org_id: orgId,
				status: { $nin: [EngagementStatus.Closed, EngagementStatus.Completed] }
			}
		)

		return result.items.sort(this.sortBy).map(createGQLEngagement)
	}
}
