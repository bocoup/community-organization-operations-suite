/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Attribute, Contact, Engagement } from '@resolve/schema/lib/provider-types'
import type { DbContact } from '~db'
import { createGQLAddress } from './createGQLAddress'

export function createGQLContact(
	contact: DbContact,
	engagements: Engagement[] = [],
	attributes: Attribute[] = []
): Contact {
	return {
		__typename: 'Contact',
		// resolve in resolver stack
		engagements,
		id: contact.id,
		name: createGQLName({
			first: contact.first_name,
			middle: contact.middle_name,
			last: contact.last_name
		}),
		phone: contact.phone,
		dateOfBirth: contact.date_of_birth,
		email: contact.email,
		address: contact.address ? createGQLAddress(contact.address) : undefined,
		attributes: attributes?.length > 0 ? attributes : undefined
	}
}
