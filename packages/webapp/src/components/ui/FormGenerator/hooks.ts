/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, ServiceAnswerInput, ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect } from 'react'
import { empty } from '~utils/noop'
import { FormFieldManager } from './FormFieldManager'

export function useSubmitHandler(
	mgr: FormFieldManager,
	contacts: Contact[],
	onSubmit: (answer: ServiceAnswerInput) => void
) {
	return useCallback(() => {
		mgr.contacts = empty
		const formData: ServiceAnswerInput = {
			serviceId: mgr.service.id,
			contacts: contacts.map((c) => c.id),
			fields: mgr.values
		}
		onSubmit(formData)
	}, [mgr, contacts, onSubmit])
}

export function useContactSynchronization(
	mgr: FormFieldManager,
	record: ServiceAnswer,
	editMode: boolean,
	onChange: (contacts: Contact[]) => void
) {
	useEffect(() => {
		if (editMode && record?.contacts.length > 0) {
			mgr.contacts = record.contacts.map((c) => c.id)
			onChange(record.contacts)
		}
	}, [record?.contacts, mgr, editMode, onChange])
}
