/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { cloneDeep } from 'lodash'
import type { UpdateServiceAnswerCallback } from '~hooks/api/useServiceAnswerList/useUpdateServiceAnswerCallback'

export function updateServiceAnswerClient(
	serviceAnswerToUpdate,
	contactId: string,
	serviceId: string,
	updateServiceAnswerCallback: UpdateServiceAnswerCallback
) {
	if (serviceAnswerToUpdate) {
		const serviceAnswerCopy = cloneDeep(serviceAnswerToUpdate)
		delete serviceAnswerCopy.__typename
		for (let i = serviceAnswerCopy.fields.length - 1; i >= 0; --i) {
			const field = serviceAnswerCopy.fields[i]
			if (field.values === null && field.value === null) {
				serviceAnswerCopy.fields.splice(i, 1)
			} else if (field.values === null) {
				delete field.values
			} else if (field.value === null) {
				delete field.value
			}
			delete field.__typename
		}
		const contacts = [...serviceAnswerCopy.contacts, contactId]

		updateServiceAnswerCallback({
			...serviceAnswerCopy,
			contacts,
			serviceId: serviceId
		})
	}
}
