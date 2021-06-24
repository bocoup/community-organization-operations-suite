/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ContactInput } from '@greenlight/schema/lib/provider-types'
import { DbContact } from '~db'
import { v4 as createId } from 'uuid'

export function createDBContact(contact: ContactInput): DbContact {
	return {
		id: createId(),
		org_id: contact.orgId,
		first_name: contact.first,
		middle_name: contact.middle || undefined,
		last_name: contact.last,
		date_of_birth: contact.dateOfBirth || undefined,
		email: contact.email || undefined,
		phone: contact.phone || undefined,
		address: contact?.address
			? {
					street: contact.address?.street || '',
					unit: contact.address?.unit || '',
					city: contact.address?.city || '',
					state: contact.address?.state || '',
					zip: contact.address?.zip || ''
			  }
			: undefined,
		attributes: contact?.attributes || undefined
	}
}
