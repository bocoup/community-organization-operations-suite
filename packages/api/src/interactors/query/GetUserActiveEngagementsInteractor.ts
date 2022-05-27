/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Engagement,
	EngagementStatus,
	QueryUserActiveEngagementsArgs
} from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Configuration } from '~components/Configuration'
import { EngagementCollection } from '~db/EngagementCollection'
import { DbEngagement } from '~db/types'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { empty } from '~utils/noop'

@singleton()
export class GetUserActiveEngagementsInteractor
	implements Interactor<unknown, QueryUserActiveEngagementsArgs, Engagement[]>
{
	public constructor(
		protected engagements: EngagementCollection,
		protected config: Configuration
	) {}

	protected sortBy(a: DbEngagement, b: DbEngagement) {
		return sortByDate({ date: a.end_date as string }, { date: b.end_date as string })
	}
	public async execute(
		_: unknown,
		{ orgId, userId, offset, limit }: QueryUserActiveEngagementsArgs,
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
				user_id: userId,
				status: { $nin: [EngagementStatus.Closed, EngagementStatus.Completed] }
			}
		)

		return result.items.sort(this.sortBy).map(createGQLEngagement)
	}
}
