/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DbMention } from '~db/types'
import { createAuditFields } from './createAuditFields'

export function createDBMention(
	engagementId: string,
	createdBy: string,
	createdDate?: string,
	message?: string
): DbMention {
	return {
		engagement_id: engagementId,
		created_at: createdDate ?? new Date().toISOString(),
		created_by: createdBy,
		message,
		seen: false,
		dismissed: false,
		...createAuditFields()
	}
}
