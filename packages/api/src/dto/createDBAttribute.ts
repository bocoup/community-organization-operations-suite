/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AttributeInput } from '@community-organization-operations-suite/schema/lib/provider-types'
import { v4 as createId } from 'uuid'
import { DbAttribute } from '~db'

export function createDBAttribute(attribute: AttributeInput): DbAttribute {
	return {
		id: createId(),
		label: attribute.label || '',
		description: attribute.description || undefined
	}
}
