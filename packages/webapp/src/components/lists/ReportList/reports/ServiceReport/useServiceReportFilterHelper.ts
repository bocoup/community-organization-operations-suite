/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswer, ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import {
	applyDateFilter,
	applyNumberFilter,
	applyOptionsFilter,
	applyStringFilterValue
} from '~utils/filters'
import { empty } from '~utils/noop'
import { IFieldFilter } from '../../types'
import { FilterHelper } from '../types'

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
	if (id === NAME) {
		return applyStringFilterValue(
			filterValue[0],
			data,
			(a) => `${a.contacts[0].name.first} ${a.contacts[0].name.last}`
		)
	} else if (id === TAGS) {
		return data.filter((answer) => {
			const tagIds = answer.contacts[0].tags.map((tag) => tag.id)
			for (const v of filterValue as any[]) {
				if (tagIds.includes(v)) {
					return true
				}
			}
			return false
		})
	} else if (id === RACE) {
		return applyStringFilterValue(filterValue[0], data, (answer) => {
			return utils.getDemographicValue('race', answer.contacts[0])
		})
	} else if (ADDRESS_FIELDS.includes(id)) {
		return applyStringFilterValue(filterValue[0], data, (a) => a?.contacts[0]?.address?.[id] || '')
	} else if (DEMOGRAPHICS_FIELDS.includes(id)) {
		return applyStringFilterValue(
			filterValue[0],
			data,
			(a) => a?.contacts[0]?.demographics?.[id] || ''
		)
	} else if (type === ServiceFieldType.Date) {
		const [_from, _to] = filterValue as string[]
		const from = _from ? new Date(_from) : undefined
		const to = _to ? new Date(_to) : undefined
		return applyDateFilter(from, to, data, (a: ServiceAnswer) => {
			const field = a.fields.find((f) => f.fieldId === id)
			if (field) {
				const date = new Date(field.value)
				date.setHours(0, 0, 0, 0)
				return date
			}
		})
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
