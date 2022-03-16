/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbTag } from '~db/types'
import { createAuditFields } from './createAuditFields'

export function createDBTag(tag: TagInput, actor: string): DbTag {
	return {
		id: createId(),
		label: tag.label || '',
		description: tag.description || undefined,
		org_id: tag.orgId,
		category: tag.category ?? undefined,
		...createAuditFields(actor)
	}
}
