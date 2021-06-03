/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLAction } from './createGQLAction'
import type { Engagement } from '@greenlight/schema/lib/provider-types'
import type { DbEngagement } from '~db'

export function createGQLEngagement(engagement: DbEngagement): Engagement {
	console.log('createGQLEngagement', createGQLEngagement)

	return {
		__typename: 'Engagement',
		id: engagement.id,
		orgId: engagement.org_id,
		actions: engagement.actions.map((e) =>
			createGQLAction(e, engagement.org_id)
		),
		startDate: engagement.start_date,
		endDate: engagement.end_date,
		description: engagement.description,
		status: engagement.status,
		user: engagement.user_id as any,
		contact: engagement.contact_id as any,
		// These are just IDs, resolve into tag objects in the resolve stack
		// TODO: change any to proper tags type
		tags: engagement.tags as any,
	}
}
