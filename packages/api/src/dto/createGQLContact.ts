/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Contact } from '@greenlight/schema/lib/provider-types'
import type { DbContact } from '~db'

export function createGQLContact(contact: DbContact): Contact {
	return {
		__typename: 'Contact',
		// resolve in resolver stack
		engagements: [],
		id: contact.id,
		name: createGQLName(
			contact.first_name,
			contact.middle_name,
			contact.last_name
		),
	}
}
