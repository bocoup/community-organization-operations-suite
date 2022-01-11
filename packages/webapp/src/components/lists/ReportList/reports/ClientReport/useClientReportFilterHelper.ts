/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { applyDateFilter, applyStringFilterValue } from '~utils/filters'
import { IFieldFilter } from '../../types'
import { FilterHelper } from '../types'

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

function clientFilterHelper(data: Contact[], filter: IFieldFilter): Contact[] {
	const { id, value } = filter

	if (id === DATE_OF_BIRTH) {
		const [_from, _to] = value as string[]
		const from = _from ? new Date(_from) : undefined
		const to = _to ? new Date(_to) : undefined
		return applyDateFilter(from, to, data, (c) => {
			const birthdate = c.dateOfBirth ? new Date(c.dateOfBirth) : null
			birthdate?.setHours(0, 0, 0, 0)
			return birthdate
		})
	} else if (id === NAME) {
		return applyStringFilterValue(
			value[0],
			data,
			(contact) => `${contact.name.first} ${contact.name.last}`
		)
	} else if (id === RACE) {
		return applyStringFilterValue(value[0], data, (contact) => contact.demographics?.race)
	} else if (id === TAGS) {
		return applyStringFilterValue(value[0], data, (contact) => {
			if (contact?.tags?.length > 0) {
				let tags = ''
				contact.tags.forEach((tag) => {
					tags += tag.label
				})
				return tags.slice(0, -2)
			}
			return ''
		})
	} else if (ADDRESS_FIELDS.includes(id)) {
		return applyStringFilterValue(value[0], data, (contact) => contact?.address?.[id] || '')
	} else if (DEMOGRAPHICS_FIELDS.includes(id)) {
		return applyStringFilterValue(value[0], data, (contact) => contact.demographics[id] || '')
	} else {
		return data.filter((contact) => (value as any[]).includes(contact[id]))
	}
}

const DATE_OF_BIRTH = 'dateOfBirth'
const NAME = 'name'
const RACE = 'race'
const TAGS = 'tags'
const ADDRESS_FIELDS = ['city', 'county', 'state', 'zip', 'street', 'unit']
const DEMOGRAPHICS_FIELDS = [
	'gender',
	'race',
	'ethnicity',
	'preferredLanguage',
	'preferredContactMethod',
	'preferredContactTime'
]
