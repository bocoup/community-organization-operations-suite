/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DbAuditable } from '~db/types'

export function createAuditFields(actor: string): DbAuditable {
	const now = new Date().getTime()
	return {
		creation_date: now,
		update_date: now,
		audit_log: [
			{
				date: now,
				description: 'create',
				actor: actor
			}
		]
	}
}
