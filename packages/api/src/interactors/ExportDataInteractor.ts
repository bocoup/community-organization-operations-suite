/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrganizationIdInput, Engagement } from '@cbosuite/schema/dist/provider-types'
import { EngagementCollection } from '~db'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { empty } from '~utils/noop'

const QUERY = {}

export class ExportDataInteractor implements Interactor<OrganizationIdInput, Engagement[]> {
	public constructor(private readonly engagements: EngagementCollection) {}

	public async execute({ orgId }: OrganizationIdInput, ctx: RequestContext): Promise<Engagement[]> {
		// out-of-org users should not export org data
		if (orgId !== ctx.orgId) {
			return empty
		}
		const result = await this.engagements.items(QUERY, { org_id: orgId })
		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map(createGQLEngagement)
	}
}
