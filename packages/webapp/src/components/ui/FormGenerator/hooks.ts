/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Contact, ServiceAnswerInput, ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect } from 'react'
import type { FormFieldManager } from './FormFieldManager'

export function useSubmitHandler(
	mgr: FormFieldManager,
	contacts: Contact[],
	onSubmit: (answer: ServiceAnswerInput) => void
) {
	return useCallback(() => {
		onSubmit({ ...mgr.value })
		mgr.reset()
	}, [mgr, onSubmit])
}

export function useContactSynchronization(
	mgr: FormFieldManager,
	record: ServiceAnswer,
	editMode: boolean,
	onChange: (contacts: Contact[]) => void
) {
	useEffect(() => {
		if (editMode && record?.contacts.length > 0) {
			mgr.value.contacts = record.contacts.map((c) => c.id)
			onChange(record.contacts)
		}
	}, [record?.contacts, mgr, editMode, onChange])
}
