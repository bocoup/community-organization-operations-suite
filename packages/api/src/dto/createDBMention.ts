/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DbMention } from '~db'

export function createDBMention(engagementId: string): DbMention {
	return {
		engagement_id: engagementId,
		created_at: new Date().toISOString(),
		seen: false,
	}
}
