/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLAction } from './createGQLAction'
import type { Engagement } from '@cbosuite/schema/dist/provider-types'
import type { DbEngagement } from '~db/types'
import { sortByDate } from '~utils'

const ENGAGEMENT_TYPE = 'Engagement'

export function createGQLEngagement(engagement: DbEngagement): Engagement {
	return {
		__typename: ENGAGEMENT_TYPE,
		id: engagement.id,
		orgId: engagement.org_id,
		actions: engagement.actions.map((e) => createGQLAction(e, engagement.org_id)).sort(sortByDate),
		startDate: engagement.start_date,
		endDate: engagement.end_date,
		title: engagement.title,
		description: engagement.description,
		status: engagement.status,
		user: engagement.user_id as any,
		contacts: engagement.contacts as any,
		// These are just IDs, resolve into tag objects in the resolve stack
		tags: (engagement.tags as any) ?? []
	}
}
