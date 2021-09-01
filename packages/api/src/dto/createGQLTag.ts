/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Tag, TagUsageCount } from '@cbosuite/schema/dist/provider-types'
import type { DbTag } from '~db'

export function createGQLTag(tag: DbTag, usageCount?: TagUsageCount): Tag {
	return {
		__typename: 'Tag',
		id: tag.id,
		orgId: tag.org_id,
		label: tag.label,
		description: tag.description,
		category: tag.category,
		usageCount: usageCount
	}
}
