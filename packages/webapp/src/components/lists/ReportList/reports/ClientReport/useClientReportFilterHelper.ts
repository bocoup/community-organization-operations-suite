/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import {
	applyStringFilterValue,
	applyMultipleChoiceFilterValues,
	applyDateFilter
} from '~utils/filters'
import type { IFieldFilter } from '../../types'
import type { FilterHelper } from '../types'

export function useClientReportFilterHelper(
	setFilterHelper: (arg: { helper: FilterHelper }) => void
) {
	useEffect(
		function populateFilterHelper() {
			setFilterHelper({ helper: clientFilterHelper })
		},
		[setFilterHelper]
	)
}

function clientFilterHelper(data: Contact[], filter: IFieldFilter, utils: any): Contact[] {
	const { id, value } = filter

	if (id === NAME) {
		return applyStringFilterValue(
			value[0],
			data,
			(contact) => `${contact.name.first} ${contact.name.last}`
		)
	} else if (id === TAGS) {
		return applyMultipleChoiceFilterValues(value as string[], data, (contact) =>
			contact.tags.map((tag) => tag.id)
		)
	} else if (id === DATE_OF_BIRTH) {
		const [from, to] = value as string[]
		return applyDateFilter(from, to, data, (contact) => contact.dateOfBirth)
	} else if (ADDRESS_FIELDS.includes(id)) {
		return applyStringFilterValue(value[0], data, (contact) => contact?.address?.[id] || '')
	} else if (id === RACE) {
		return applyStringFilterValue(value[0], data, (contact) => {
			return utils.getDemographicValue('race', contact)
		})
	} else if (MULTI_CHOICE_DEMOGRAPHICS_FIELDS.includes(id)) {
		return applyMultipleChoiceFilterValues(
			value as string[],
			data,
			(contact) => contact.demographics[id] || ''
		)
	} else {
		return data.filter((contact) => (value as any[]).includes(contact[id]))
	}
}

const DATE_OF_BIRTH = 'dateOfBirth'
const NAME = 'name'
const RACE = 'race'
const TAGS = 'tags'
const ADDRESS_FIELDS = ['city', 'county', 'state', 'zip', 'street', 'unit']
const MULTI_CHOICE_DEMOGRAPHICS_FIELDS = [
	'gender',
	'ethnicity',
	'preferredLanguage',
	'preferredContactMethod',
	'preferredContactTime'
]
