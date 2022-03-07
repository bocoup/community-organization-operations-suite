/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TagInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import type { DbTag } from '~db/types'

export function createDBTag(tag: TagInput): DbTag {
	return {
		id: createId(),
		label: tag.label || '',
		description: tag.description || undefined,
		org_id: tag.orgId,
		category: tag.category ?? undefined
	}
}
