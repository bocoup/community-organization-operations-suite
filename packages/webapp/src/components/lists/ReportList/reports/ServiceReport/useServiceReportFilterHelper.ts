/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import {
	applyDateFilter,
	applyMultipleChoiceFilterValues,
	applyNumberFilter,
	applyOptionsFilter,
	applyStringFilterValue
} from '~utils/filters'
import { empty } from '~utils/noop'
import type { IFieldFilter } from '../../types'
import type { FilterHelper } from '../types'

export function useServiceReportFilterHelper(
	setFilterHelper: (arg: { helper: FilterHelper }) => void
) {
	useEffect(
		function populateFilterHelper() {
			setFilterHelper({ helper: serviceFilterHelper })
		},
		[setFilterHelper]
	)
}

function serviceFilterHelper(
	data: ServiceAnswer[],
	{ id, value: filterValue, type }: IFieldFilter,
	utils: any
): ServiceAnswer[] {
	// Contact filters
	if (id === NAME) {
		return applyStringFilterValue(
			filterValue[0],
			data,
			(a) => `${a.contacts[0].name.first} ${a.contacts[0].name.last}`
		)
	} else if (id === CLIENT_TAGS) {
		return applyMultipleChoiceFilterValues(filterValue as string[], data, (request) =>
			request?.contacts[0]?.tags.map((tag) => tag.id)
		)
	} else if (id === DATE_OF_BIRTH) {
		const [from, to] = filterValue as string[]
		return applyDateFilter(from, to, data, (request) => request?.contacts[0]?.dateOfBirth)
	} else if (id === RACE) {
		return applyStringFilterValue(filterValue[0], data, (request) => {
			return utils.getDemographicValue('race', request?.contacts[0])
		})
	} else if (ADDRESS_FIELDS.includes(id)) {
		return applyStringFilterValue(filterValue[0], data, (a) => a?.contacts[0]?.address?.[id] || '')
	} else if (MULTI_CHOICE_DEMOGRAPHIC_FIELDS.includes(id)) {
		return applyMultipleChoiceFilterValues(
			filterValue as string[],
			data,
			(a) => a?.contacts[0]?.demographics[id] || ''
		)
	}

	// Service filters
	else if (type === ServiceFieldType.Date) {
		const [from, to] = filterValue as string[]
		return applyDateFilter(from, to, data, (a) => a.fields.find((f) => f.fieldId === id)?.value)
	} else if (type === ServiceFieldType.Number) {
		const [_lower, _upper] = filterValue as number[]
		return applyNumberFilter(_lower, _upper, data, (a: ServiceAnswer) => {
			const field = a.fields.find((f) => f.fieldId === id)
			if (field) {
				return parseFloat(field.value) as number
			}
		})
	} else if ([ServiceFieldType.SingleText, ServiceFieldType.MultilineText].includes(type)) {
		return applyStringFilterValue(filterValue[0], data, (a: ServiceAnswer) => {
			const field = a.fields.find((f) => f.fieldId === id)
			if (field) {
				return field?.value || ''
			}
		})
	} else {
		return applyOptionsFilter(filterValue as string[], data, (item: ServiceAnswer) => {
			const field = item.fields.find((f) => f.fieldId === id)
			if (field) {
				// single-select is in value, multi-select is in values
				return [field.value, ...(field.values ?? empty)].filter((t) => !!t)
			}
		})
	}
}

const NAME = 'name'
const RACE = 'race'
const DATE_OF_BIRTH = 'dateOfBirth'
const CLIENT_TAGS = 'tags'
const ADDRESS_FIELDS = ['city', 'county', 'state', 'zip', 'street', 'unit']
const MULTI_CHOICE_DEMOGRAPHIC_FIELDS = [
	'gender',
	'ethnicity',
	'preferredLanguage',
	'preferredContactMethod',
	'preferredContactTime'
]
