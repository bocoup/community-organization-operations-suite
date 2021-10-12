/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, ServiceAnswerInput, ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect } from 'react'
import { FormFieldManager } from './FormFieldManager'

export function useSubmitHandler(
	mgr: FormFieldManager,
	contacts: Contact[],
	onSubmit: (answer: ServiceAnswerInput) => void
) {
	return useCallback(() => {
		// discard formvalues contact before submit
		const formValuesCopy = { ...mgr.values, contacts: undefined }
		const formData: ServiceAnswerInput = {
			serviceId: mgr.service.id,
			contacts: contacts.map((c) => c.id),
			fieldAnswers: formValuesCopy
		}
		onSubmit(formData)
	}, [mgr, contacts, onSubmit])
}

export function useContactSynchronization(
	mgr: FormFieldManager,
	record: ServiceAnswers,
	editMode: boolean,
	onChange: (contacts: Contact[]) => void
) {
	useEffect(() => {
		if (editMode && record?.contacts.length > 0) {
			mgr.values['contacts'] = record.contacts.map((c) => c.id)
			onChange(record.contacts)
		}
	}, [record?.contacts, mgr, editMode, onChange])
}
