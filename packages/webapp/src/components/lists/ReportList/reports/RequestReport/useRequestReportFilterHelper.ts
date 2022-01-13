/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import {
	applyDateFilter,
	applyStringFilterValue,
	applyMultiStringFilterValue
} from '~utils/filters'
import { IFieldFilter } from '../../types'
import { FilterHelper } from '../types'

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
	if (id === DATE_OF_BIRTH) {
		const [_from, _to] = value as string[]
		const from = _from ? new Date(_from) : undefined
		const to = _to ? new Date(_to) : undefined
		return applyDateFilter(from, to, data, (request) => {
			const birthdate = request?.contacts[0]?.dateOfBirth
				? new Date(request.contacts[0].dateOfBirth)
				: null
			birthdate?.setHours(0, 0, 0, 0)
			return birthdate
		})
	} else if (id === NAME) {
		return applyStringFilterValue(
			value[0],
			data,
			(request) => `${request?.contacts[0]?.name.first} ${request?.contacts[0]?.name.last}`
		)
	} else if (id === TAGS) {
		return data.filter((request) => {
			const tagIds = request?.contacts[0]?.tags.map((tag) => tag.id)
			for (const v of value as any[]) {
				if (tagIds.includes(v)) {
					return true
				}
			}
			return false
		})
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
	} else if (DEMOGRAPHICS_FIELDS.includes(id)) {
		return applyStringFilterValue(
			value[0],
			data,
			(request) => request?.contacts[0]?.demographics?.[id] || ''
		)
	}

	// Request filters
	else if (id === START_DATE || id === END_DATE) {
		const [_from, _to] = value as string[]
		const from = _from ? new Date(_from) : undefined
		const to = _to ? new Date(_to) : undefined
		return applyDateFilter(from, to, data, (request) => {
			return request?.[id] ? new Date(request[id]) : null
		})
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

// request filters
const START_DATE = 'startDate'
const END_DATE = 'endDate'
const SPECIALIST = 'specialist'
