/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement, EngagementIdInput } from '@cbosuite/schema/dist/provider-types'
import { EngagementCollection } from '~db'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'

export class GetEngagementInteractor implements Interactor<EngagementIdInput, Engagement | null> {
	public constructor(private readonly engagements: EngagementCollection) {}

	public async execute(
		{ engId }: EngagementIdInput,
		ctx: RequestContext
	): Promise<Engagement | null> {
		const result = await this.engagements.itemById(engId)
		if (!result.item) {
			return null
		} else if (ctx.orgId !== result.item.org_id) {
			// out-of-org users should not see org engagements
			return null
		} else {
			return result.item ? createGQLEngagement(result.item) : null
		}
	}
}
