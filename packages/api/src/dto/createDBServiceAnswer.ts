/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswerInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbServiceAnswer } from '~db/types'
import { empty } from '~utils/noop'
import { createDbServiceAnswerField } from './createDbServiceAnswerField'
import { createAuditFields } from './createAuditFields'

export function createDBServiceAnswer(answer: ServiceAnswerInput, actor: string): DbServiceAnswer {
	return {
		id: createId(),
		service_id: answer.serviceId,
		contacts: answer.contacts || empty,
		fields: answer.fields.map(createDbServiceAnswerField) || empty,
		...createAuditFields(actor)
	}
}
