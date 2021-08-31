/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { EngagementInput, EngagementStatus } from '@cbosuite/schema/lib/provider-types'
import type { DbEngagement } from '~db'
import { v4 as createId } from 'uuid'

export function createDBEngagement(engagement: EngagementInput): DbEngagement {
	const start_date = new Date().toISOString()
	let end_date

	if (engagement?.duration) {
		end_date = new Date()
		end_date.setTime(end_date.getTime() + parseInt(engagement.duration) * 60 * 60 * 1000)
		end_date = end_date.toISOString()
	}

	return {
		id: createId(),
		org_id: engagement.orgId,
		start_date,
		end_date,
		title: engagement.title,
		description: engagement.description,
		status: engagement.userId ? EngagementStatus.Assigned : EngagementStatus.Open,
		actions: [],
		user_id: engagement.userId as any,
		contacts: engagement.contactIds as any,
		tags: engagement.tags as any
	}
}
