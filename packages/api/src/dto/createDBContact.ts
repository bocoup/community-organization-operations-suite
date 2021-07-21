/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ContactInput } from '@resolve/schema/lib/provider-types'
import { DbContact } from '~db'
import { v4 as createId } from 'uuid'

export function createDBContact(contact: ContactInput, password: string): DbContact {
	const hasAddress =
		!!contact?.address?.street ||
		!!contact?.address?.city ||
		!!contact?.address?.state ||
		!!contact?.address?.zip
	const hasPhone = !!contact?.phone
	const hasDateOfBirth = !!contact?.dateOfBirth

	const accessibleFields = ['name', 'email']
	if (hasAddress) {
		accessibleFields.push('address')
	}

	if (hasPhone) {
		accessibleFields.push('phone')
	}

	if (hasDateOfBirth) {
		accessibleFields.push('dateOfBirth')
	}

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
		attributes: contact?.attributes || undefined,
		password: password,
		delegates: [
			{
				id: contact.specialistId,
				org_id: contact.orgId,
				hasAccessTo: accessibleFields
			}
		]
	}
}
