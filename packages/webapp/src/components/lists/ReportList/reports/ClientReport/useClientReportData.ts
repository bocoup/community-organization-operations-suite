/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { useContacts } from '~hooks/api/useContacts'
import { empty } from '~utils/noop'

export function useClientReportData(
	setUnfilteredData: (data: unknown[]) => void,
	setFilteredData: (data: unknown[]) => void
) {
	const activeClients = useActiveClients()
	setUnfilteredData(activeClients)
	setFilteredData(activeClients)
}

function useActiveClients() {
	const { contacts } = useContacts()
	return useMemo<Contact[]>(
		() => contacts?.filter((contact) => contact.status !== ContactStatus.Archived) ?? empty,
		[contacts]
	)
}
