/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswerInput } from '@cbosuite/schema/dist/provider-types'
import { v4 as createId } from 'uuid'
import { DbServiceAnswer } from '~db'

export function createDBServiceAnswer(serviceAnswer: ServiceAnswerInput): DbServiceAnswer {
	return {
		id: createId(),
		contacts: serviceAnswer.contacts || [],
		fieldAnswers:
			{
				singleText: serviceAnswer.fieldAnswers.singleText || undefined,
				multilineText: serviceAnswer.fieldAnswers.multilineText || undefined,
				date: serviceAnswer.fieldAnswers.date || undefined,
				number: serviceAnswer.fieldAnswers.number || undefined,
				singleChoice: serviceAnswer.fieldAnswers.singleChoice || undefined,
				multiText: serviceAnswer.fieldAnswers.multiText || undefined,
				multiChoice: serviceAnswer.fieldAnswers.multiChoice || undefined
			} || undefined
	}
}
