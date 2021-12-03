/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { ArchiveContactCallback, useArchiveContactCallback } from './useArchiveContactCallback'
import { UpdateContactCallback, useUpdateContactCallback } from './useUpdateContactCallback'
import { CreateContactCallback, useCreateContactCallback } from './useCreateContactCallback'
import { useContactList } from './useContactList'

interface useContactReturn {
	contacts: Contact[]
	createContact: CreateContactCallback
	updateContact: UpdateContactCallback
	archiveContact: ArchiveContactCallback
}

export function useContacts(): useContactReturn {
	const contacts = useContactList()
	const createContact = useCreateContactCallback()
	const updateContact = useUpdateContactCallback()
	const archiveContact = useArchiveContactCallback()

	return {
		contacts,
		createContact,
		updateContact,
		archiveContact
	}
}
