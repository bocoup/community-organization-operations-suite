/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Contact } from '@cbosuite/schema/dist/client-types'
import { ContactStatus } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useContactSearchHandler(items: Contact[], onFilter: (filted: Contact[]) => void) {
	return useSearchHandler(
		items,
		onFilter,
		(contact, search) =>
			(contact.name.first.toLowerCase().indexOf(search) > -1 ||
				contact.name.last.toLowerCase().indexOf(search) > -1) &&
			contact.status !== ContactStatus.Archived
	)
}
