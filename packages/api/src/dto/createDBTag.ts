/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagInput } from '@cbosuite/schema/lib/provider-types'
import { v4 as createId } from 'uuid'
import { DbTag } from '~db'

export function createDBTag(tag: TagInput): DbTag {
	return {
		id: createId(),
		label: tag.label || '',
		description: tag.description || undefined
	}
}
