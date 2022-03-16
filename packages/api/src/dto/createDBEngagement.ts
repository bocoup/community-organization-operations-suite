/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { EngagementInput, EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import { DbEngagement } from '~db/types'
import { v4 as createId } from 'uuid'
import { createAuditFields } from './createAuditFields'

export function createDBEngagement(engagement: EngagementInput, actor: string): DbEngagement {
	const start_date = new Date().toISOString()

	return {
		id: createId(),
		org_id: engagement.orgId,
		start_date,
		end_date: engagement.endDate || undefined,
		title: engagement.title,
		description: engagement.description,
		status: engagement.userId ? EngagementStatus.Assigned : EngagementStatus.Open,
		actions: [],
		user_id: engagement.userId as any,
		contacts: engagement.contactIds as any,
		tags: engagement.tags as any,
		...createAuditFields(actor)
	}
}
