/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ContactEngagement } from '@resolve/schema/lib/provider-types'
import type { DbEngagement } from '~db'

export function createGQLContactEngagement(engagement: DbEngagement): ContactEngagement {
	return {
		__typename: 'ContactEngagement',
		id: engagement.id,
		orgId: engagement.org_id,
		startDate: engagement.start_date,
		endDate: engagement.end_date,
		description: engagement.description,
		status: engagement.status,
		user: engagement.user_id as any
	}
}
