/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement, QueryEngagementArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { EngagementCollection } from '~db/EngagementCollection'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'

@singleton()
export class GetEngagementInteractor implements Interactor<QueryEngagementArgs, Engagement | null> {
	public constructor(private engagements: EngagementCollection) {}

	public async execute(
		{ engagementId }: QueryEngagementArgs,
		ctx: RequestContext
	): Promise<Engagement | null> {
		const result = await this.engagements.itemById(engagementId)
		if (result.item == null) {
			return null
		} else if (!ctx.identity?.roles.some((r) => r.org_id === result.item!.org_id)) {
			// out-of-org users should not see org engagements
			return null
		} else {
			return result.item ? createGQLEngagement(result.item) : null
		}
	}
}
