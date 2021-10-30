/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Contact } from '@cbosuite/schema/dist/provider-types'
import type { DbContact } from '~db/types'
import { createGQLAddress } from './createGQLAddress'

const CONTACT_TYPE = 'Contact'

export function createGQLContact(contact: DbContact): Contact {
	return {
		__typename: CONTACT_TYPE,
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
		status: contact.status,
		engagements: [],
		tags: [],
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
