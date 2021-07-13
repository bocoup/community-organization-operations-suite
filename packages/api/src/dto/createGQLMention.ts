/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Mention } from '@resolve/schema/lib/provider-types'
import type { DbMention } from '~db'

export function createGQLMention(mention: DbMention): Mention {
	return {
		__typename: 'Mention',
		engagementId: mention.engagement_id,
		createdAt: mention.created_at,
		seen: mention.seen
	}
}
