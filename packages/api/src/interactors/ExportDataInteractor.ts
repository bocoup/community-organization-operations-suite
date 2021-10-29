/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { QueryExportDataArgs, Engagement } from '@cbosuite/schema/dist/provider-types'
import { createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { empty } from '~utils/noop'
import { singleton } from 'tsyringe'
import { EngagementCollection } from '~db/EngagementCollection'
import { Telemetry } from '~components/Telemetry'

const QUERY = {}

@singleton()
export class ExportDataInteractor implements Interactor<QueryExportDataArgs, Engagement[]> {
	public constructor(private engagements: EngagementCollection, private telemetry: Telemetry) {}

	public async execute({ orgId }: QueryExportDataArgs, ctx: RequestContext): Promise<Engagement[]> {
		// out-of-org users should not export org data
		if (!ctx.identity?.roles.some((r) => r.org_id === orgId)) {
			return empty
		}

		const result = await this.engagements.items(QUERY, { org_id: orgId })
		this.telemetry.trackEvent('ExportData')
		return result.items
			.sort((a, b) => sortByDate({ date: a.start_date }, { date: b.start_date }))
			.map(createGQLEngagement)
	}
}
