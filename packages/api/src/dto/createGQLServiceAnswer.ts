/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ServiceAnswer } from '@cbosuite/schema/dist/provider-types'
import type { DbServiceAnswer } from '~db/types'

const SERVICE_ANSWER_TYPE = 'ServiceAnswer'

export function createGQLServiceAnswer(answer: DbServiceAnswer): ServiceAnswer {
	return {
		__typename: SERVICE_ANSWER_TYPE,
		id: answer.id,
		serviceId: answer.service_id,
		// Handle in resolver
		contacts: answer.contacts as any,
		fields: answer.fields.map((f) => {
			return {
				fieldId: f.field_id,
				value: !Array.isArray(f.value) ? f.value : undefined,
				values: Array.isArray(f.value) ? f.value : undefined
			}
		})
	}
}
