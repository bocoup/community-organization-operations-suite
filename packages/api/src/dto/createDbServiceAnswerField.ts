/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswerFieldInput } from '@cbosuite/schema/dist/provider-types'
import { DbServiceAnswerField } from '~db/types'

export function createDbServiceAnswerField(input: ServiceAnswerFieldInput): DbServiceAnswerField {
	if (input.value != null && input.values != null) {
		throw new Error('field input cannot have both `value` and `values` set')
	}
	if (input.value == null && input.values == null) {
		throw new Error('field must have either `value` or `values` defined')
	}
	const value = (input.values ?? input.value)!
	return {
		field_id: input.fieldId,
		value
	}
}
