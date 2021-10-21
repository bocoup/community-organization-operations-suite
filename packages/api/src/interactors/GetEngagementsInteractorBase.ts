/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Engagement,
	QueryActiveEngagementsArgs,
	EngagementStatus
} from '@cbosuite/schema/dist/provider-types'
import { Condition } from 'mongodb'
import { DbEngagement, EngagementCollection } from '~db'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

export abstract class GetEngagementsInteractorBase
	implements Interactor<QueryActiveEngagementsArgs, Engagement[]>
{
	public constructor(
		private readonly engagements: EngagementCollection,
		private readonly defaultPageOffset: number,
		private readonly defaultPageLimit: number
	) {}

	protected abstract status: Condition<EngagementStatus>
	protected abstract sortBy(a: DbEngagement, b: DbEngagement): number

	public async execute(
		{ orgId, offset, limit }: QueryActiveEngagementsArgs,
		ctx: RequestContext
	): Promise<Engagement[]> {
		offset = offset ?? this.defaultPageOffset
		limit = limit ?? this.defaultPageLimit

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
