/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DbAuditable } from '~db/types'

export function createAuditFields(): DbAuditable {
	return {
		creation_date: new Date().getTime(),
		update_date: new Date().getTime(),
		audit_log: []
	}
}
