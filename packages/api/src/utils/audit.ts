/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DbAuditLogEntry } from '~db/types'

export function createAuditLog(description: string, actor: string): [DbAuditLogEntry, string] {
	const now = new Date().toISOString()
	return [{ date: now, description, actor }, now]
}
