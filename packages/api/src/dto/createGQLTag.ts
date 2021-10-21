/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Tag, TagCategory } from '@cbosuite/schema/dist/provider-types'
import type { DbTag } from '~db'

const TAG_TYPE = 'Tag'

export function createGQLTag(tag: DbTag): Tag {
	return {
		__typename: TAG_TYPE,
		id: tag.id,
		orgId: tag.org_id,
		label: tag.label,
		description: tag.description,
		category: tag.category as TagCategory,
		// TagUsageCount resolver hints
		usageCount: {
			tag_id: tag.id,
			org_id: tag.org_id
		} as any
	}
}
