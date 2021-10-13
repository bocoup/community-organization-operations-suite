/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { IFieldFilter } from '../../types'
import { FilterHelper } from '../types'

export function useServiceReportFilterHelper(
	setFilterHelper: (arg: { helper: FilterHelper }) => void
) {
	useEffect(() => {
		setFilterHelper({ helper: serviceFilterHelper })
	}, [setFilterHelper])
}

function serviceFilterHelper(
	serviceAnswers: ServiceAnswers[],
	{ id: filterId, value: filterValue, fieldType }: IFieldFilter
): ServiceAnswers[] {
	let tempList = []
	if (filterId === 'name') {
		const searchStr = filterValue[0]
		if (searchStr === '') {
			return serviceAnswers
		}

		tempList = serviceAnswers.filter((item) => {
			const fullName = `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
			return fullName.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else if ((['gender', 'race', 'ethnicity'] as string[]).includes(filterId)) {
		tempList = serviceAnswers.filter((answer) =>
			(filterValue as string[]).includes(answer.contacts[0].demographics[filterId])
		)
	} else {
		if (fieldType === 'date') {
			const [_from, _to] = filterValue as string[]
			const from = _from ? new Date(_from) : undefined
			const to = _to ? new Date(_to) : undefined

			if (!from && !to) {
				return serviceAnswers
			}

			serviceAnswers.forEach((answer) => {
				answer.fieldAnswers[fieldType]?.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === filterId) {
						const answerDate = new Date(fieldAnswer.values)
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
		} else if (fieldType === 'number') {
			const [_lower, _upper] = filterValue as number[]

			serviceAnswers.forEach((answer) => {
				answer.fieldAnswers[fieldType]?.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === filterId) {
						const answerNumber = Number(fieldAnswer.values)
						if (_lower && _upper && answerNumber >= _lower && answerNumber <= _upper) {
							tempList.push(answer)
						}
					}
				})
			})
		} else if (['singleText', 'multilineText'].includes(fieldType)) {
			const searchStr = filterValue[0]
			if (searchStr === '') {
				return serviceAnswers
			}

			serviceAnswers.forEach((answer) => {
				answer.fieldAnswers[fieldType]?.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === filterId) {
						const answerStr = fieldAnswer?.values || ' '
						if (answerStr.toLowerCase().includes(searchStr.toLowerCase())) {
							tempList.push(answer)
						}
					}
				})
			})
		} else {
			const filterValues = filterValue as string[]

			serviceAnswers.forEach((answer) => {
				answer.fieldAnswers[fieldType]?.forEach((fieldAnswer) => {
					if (fieldAnswer.fieldId === filterId) {
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
