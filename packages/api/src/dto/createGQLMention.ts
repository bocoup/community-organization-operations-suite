/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Mention } from '@cbosuite/schema/lib/provider-types'
import type { DbMention } from '~db'

export function createGQLMention(mention: DbMention): Mention {
	return {
		__typename: 'Mention',
		engagement: mention.engagement_id as any,
		createdAt: mention.created_at,
		createdBy: mention.created_by as any,
		message: mention.message,
		seen: mention.seen,
		dismissed: mention.dismissed ?? false
	}
}
