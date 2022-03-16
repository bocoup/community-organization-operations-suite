/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ContactInput, ContactStatus } from '@cbosuite/schema/dist/provider-types'
import { DbContact } from '~db/types'
import { v4 as createId } from 'uuid'
import { createAuditFields } from './createAuditFields'

export function createDBContact(contact: ContactInput, actor: string): DbContact {
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
					county: contact.address?.county || '',
					state: contact.address?.state || '',
					zip: contact.address?.zip || ''
			  }
			: undefined,
		demographics: {
			gender: contact.demographics?.gender || '',
			gender_other: contact.demographics?.genderOther || '',
			ethnicity: contact.demographics?.ethnicity || '',
			ethnicity_other: contact.demographics?.ethnicityOther || '',
			race: contact.demographics?.race || '',
			race_other: contact.demographics?.raceOther || '',
			preferred_language: contact.demographics?.preferredLanguage || '',
			preferred_language_other: contact.demographics?.preferredLanguageOther || '',
			preferred_contact_method: contact.demographics?.preferredContactMethod || '',
			preferred_contact_time: contact.demographics?.preferredContactTime || ''
		},
		tags: contact?.tags || undefined,
		status: contact?.status || ContactStatus.Active,
		notes: contact?.notes || '',
		...createAuditFields(actor)
	}
}
