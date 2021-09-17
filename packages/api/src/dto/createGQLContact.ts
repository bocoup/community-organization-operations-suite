/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Tag, Contact, Engagement } from '@cbosuite/schema/dist/provider-types'
import type { DbContact } from '~db'
import { createGQLAddress } from './createGQLAddress'

export function createGQLContact(
	contact: DbContact,
	engagements: Engagement[] = [],
	tags: Tag[] = []
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
		tags,
		status: contact.status,
		demographics: {
			gender: contact.demographics?.gender || '',
			genderOther: contact.demographics?.gender_other || '',
			ethnicity: contact.demographics?.ethnicity || '',
			ethnicityOther: contact.demographics?.ethnicity_other || '',
			race: contact.demographics?.race || '',
			raceOther: contact.demographics?.race_other || '',
			preferredContactMethod: contact.demographics?.preferred_contact_method || '',
			preferredLanguage: contact.demographics?.preferred_language || '',
			preferredLanguageOther: contact.demographics?.preferred_language_other || '',
			preferredContactTime: contact.demographics?.preferred_contact_time || ''
		}
	}
}
