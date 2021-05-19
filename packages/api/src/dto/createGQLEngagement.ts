/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLAction } from './createGQLAction'
import type { Engagement } from '@greenlight/schema/lib/provider-types'
import type { DbEngagement } from '~db'

export function createGQLEngagement(engagement: DbEngagement): Engagement {
	return {
		__typename: 'Engagement',
		orgId: engagement.org_id,
		actions: engagement.actions.map((e) =>
			createGQLAction(e, engagement.org_id)
		),
		startDate: engagement.start_date,
		endDate: engagement.end_date,
	}
}
