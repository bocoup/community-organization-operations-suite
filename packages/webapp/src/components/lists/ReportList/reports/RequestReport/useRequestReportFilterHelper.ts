/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import {
	applyStringFilterValue,
	applyMultiStringFilterValue,
	applyMultipleChoiceFilterValues,
	applyDateFilter
} from '~utils/filters'
import type { IFieldFilter } from '../../types'
import type { FilterHelper } from '../types'

export function useRequestReportFilterHelper(
	setFilterHelper: (arg: { helper: FilterHelper }) => void
) {
	useEffect(
		function populateFilterHelper() {
			setFilterHelper({ helper: requestFilterHelper })
		},
		[setFilterHelper]
	)
}

function requestFilterHelper(data: Engagement[], filter: IFieldFilter, utils: any): Engagement[] {
	const { id, value } = filter

	// Contact filters
	if (id === NAME) {
		return applyStringFilterValue(
			value[0],
			data,
			(request) => `${request?.contacts[0]?.name.first} ${request?.contacts[0]?.name.last}`
		)
	} else if (id === CLIENT_TAGS) {
		return applyMultipleChoiceFilterValues(value as string[], data, (request) =>
			request?.contacts[0]?.tags.map((tag) => tag.id)
		)
	} else if (id === DATE_OF_BIRTH) {
		const [from, to] = value as string[]
		return applyDateFilter(from, to, data, (request) => request?.contacts[0]?.dateOfBirth)
	} else if (id === RACE) {
		return applyStringFilterValue(value[0], data, (request) => {
			return utils.getDemographicValue('race', request?.contacts[0])
		})
	} else if (ADDRESS_FIELDS.includes(id)) {
		return applyStringFilterValue(
			value[0],
			data,
			(request) => request?.contacts[0]?.address?.[id] || ''
		)
	} else if (MULTI_CHOICE_DEMOGRAPHICS_FIELDS.includes(id)) {
		return applyMultipleChoiceFilterValues(
			value as string[],
			data,
			(request) => request?.contacts[0]?.demographics[id] || ''
		)
	}

	// Request filters
	else if (id === REQUEST_TAGS) {
		return applyMultipleChoiceFilterValues(value as string[], data, (request) =>
			request?.tags.map((tag) => tag.id)
		)
	} else if (id === START_DATE || id === END_DATE) {
		const [from, to] = value as string[]
		return applyDateFilter(from, to, data, (request) => request?.[id])
	} else if (id === SPECIALIST) {
		return applyMultiStringFilterValue(value[0], data, (request: Engagement) => {
			const user = request?.user

			if (user) {
				const { name, email, userName } = user
				return [`${name?.first} ${name?.last}`, email, userName]
			} else {
				return []
			}
		})
	} else {
		return applyStringFilterValue(value[0], data, (request) => request?.[id] || '')
	}
}

const DATE_OF_BIRTH = 'dateOfBirth'
const NAME = 'name'
const RACE = 'race'
const CLIENT_TAGS = 'tags'
const REQUEST_TAGS = 'requestTags'
const ADDRESS_FIELDS = ['city', 'county', 'state', 'zip', 'street', 'unit']
const MULTI_CHOICE_DEMOGRAPHICS_FIELDS = [
	'gender',
	'ethnicity',
	'preferredLanguage',
	'preferredContactMethod',
	'preferredContactTime'
]

// request filters
const START_DATE = 'startDate'
const END_DATE = 'endDate'
const SPECIALIST = 'specialist'
