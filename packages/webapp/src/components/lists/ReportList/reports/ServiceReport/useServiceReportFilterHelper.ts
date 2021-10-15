/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswer, ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
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
	serviceAnswers: ServiceAnswer[],
	{ id, value: filterValue, type }: IFieldFilter
): ServiceAnswer[] {
	let tempList = []
	if (id === 'name') {
		const searchStr = filterValue[0]
		if (searchStr === '') {
			return serviceAnswers
		}

		tempList = serviceAnswers.filter((item) => {
			const fullName = `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
			return fullName.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else if ((['gender', 'race', 'ethnicity'] as string[]).includes(id)) {
		tempList = serviceAnswers.filter((answer) =>
			(filterValue as string[]).includes(answer.contacts[0].demographics[id])
		)
	} else {
		if (type === ServiceFieldType.Date) {
			const [_from, _to] = filterValue as string[]
			const from = _from ? new Date(_from) : undefined
			const to = _to ? new Date(_to) : undefined

			if (!from && !to) {
				return serviceAnswers
			}

			serviceAnswers.forEach((answer) => {
				answer.fields.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === id) {
						const answerDate = new Date(fieldAnswer.value)
						answerDate.setHours(0, 0, 0, 0)

						if (from && to && answerDate >= from && answerDate <= to) {
							tempList.push(answer)
						}

						if (!from && answerDate <= to) {
							tempList.push(answer)
						}

						if (from && !to && answerDate >= from) {
							tempList.push(answer)
						}
					}
				})
			})
		} else if (type === ServiceFieldType.Number) {
			const [_lower, _upper] = filterValue as number[]

			serviceAnswers.forEach((answer) => {
				answer.fields.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === id) {
						const answerNumber = Number(fieldAnswer.values)
						if (_lower && _upper && answerNumber >= _lower && answerNumber <= _upper) {
							tempList.push(answer)
						}
					}
				})
			})
		} else if ([ServiceFieldType.SingleText, ServiceFieldType.MultilineText].includes(type)) {
			const searchStr = filterValue[0]
			if (searchStr === '') {
				return serviceAnswers
			}

			serviceAnswers.forEach((answer) => {
				answer.fields.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === id) {
						const answerStr = fieldAnswer?.value || ' '
						if (answerStr.toLowerCase().includes(searchStr.toLowerCase())) {
							tempList.push(answer)
						}
					}
				})
			})
		} else {
			const filterValues = filterValue as string[]

			serviceAnswers.forEach((answer) => {
				answer.fields.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === id) {
						if (Array.isArray(fieldAnswer.values)) {
							if (filterValues.length === 0) {
								tempList.push(answer)
							}
							if (fieldAnswer.values.some((value) => filterValues.includes(value))) {
								tempList.push(answer)
							}
						} else {
							if (filterValues.includes(fieldAnswer.values)) {
								tempList.push(answer)
							}
						}
					}
				})
			})
		}
	}
	return tempList
}
