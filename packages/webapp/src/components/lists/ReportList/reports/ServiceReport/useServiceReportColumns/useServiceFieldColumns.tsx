/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ServiceAnswer, ServiceField } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import styles from '../../../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import type { CustomOption } from '~components/ui/CustomOptionsFilter'
import { CustomNumberRangeFilter } from '~components/ui/CustomNumberRangeFilter'
import { ShortString } from '~components/ui/ShortString'
import { useLocale } from '~hooks/useLocale'
import { getRecordedFieldValue } from '~utils/forms'
import { useRecoilValue } from 'recoil'
import { fieldFiltersState } from '~store'
import { useGetValue } from '~components/lists/ReportList/hooks'
import { sortByAlphanumeric, sortByDate } from '~utils/sorting'
import { truncate } from 'lodash'

const DROPDOWN_FIELD_TYPES = [ServiceFieldType.SingleChoice, ServiceFieldType.MultiChoice]
const TEXT_FIELD_TYPES = [ServiceFieldType.SingleText, ServiceFieldType.MultilineText]

function shorten(value: string): string {
	const options = { length: 80, separator: ' ' }
	return truncate(value, options)
}

export function useServiceFieldColumns(
	data: unknown[],
	fields: ServiceField[],
	filterColumns: (columnId: string, option: CustomOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	hiddenFields: Record<string, boolean>,
	onTrackEvent?: (name?: string) => void
): IPaginatedTableColumn[] {
	const [locale] = useLocale()
	const fieldFilters = useRecoilValue(fieldFiltersState)
	const { getSelectedValue, getStringValue } = useGetValue(fieldFilters)

	return useMemo(
		() =>
			fields
				.filter((field) => !hiddenFields?.[field.id])
				.map((field) => ({
					key: field.id,
					name: field.name,
					headerClassName: styles.headerItemCell,
					itemClassName: styles.itemCell,
					onRenderColumnHeader(key, name) {
						if (DROPDOWN_FIELD_TYPES.includes(field.type)) {
							return (
								<CustomOptionsFilter
									defaultSelectedKeys={getSelectedValue(key) as string[]}
									filterLabel={name}
									placeholder={name}
									options={field.inputs.map((value) => ({ key: value.id, text: value.label }))}
									onFilterChanged={(option) => filterColumns(key, option)}
									onTrackEvent={onTrackEvent}
								/>
							)
						}

						if (TEXT_FIELD_TYPES.includes(field.type)) {
							return (
								<CustomTextFieldFilter
									defaultValue={getStringValue(key)}
									filterLabel={name}
									onFilterChanged={(value) => filterColumnTextValue(key, value)}
									onTrackEvent={onTrackEvent}
								/>
							)
						}

						if (field.type === ServiceFieldType.Date) {
							return (
								<CustomDateRangeFilter
									defaultSelectedDates={getSelectedValue(key) as [string, string]}
									filterLabel={name}
									onFilterChanged={({ startDate, endDate }) => {
										const sDate = startDate ? startDate.toISOString() : ''
										const eDate = endDate ? endDate.toISOString() : ''
										filterRangedValues(key, [sDate, eDate])
									}}
									onTrackEvent={onTrackEvent}
								/>
							)
						}

						if (field.type === ServiceFieldType.Number) {
							// get min and max values from service answers
							let min = 0
							let max = 0
							data.forEach((answer: ServiceAnswer) => {
								answer.fields.forEach((fieldAnswer) => {
									if (fieldAnswer.fieldId === key) {
										const answerNumber = Number(fieldAnswer.values)
										if (answerNumber > max) {
											max = answerNumber
										}
										if (answerNumber < min) {
											min = answerNumber
										}
									}
								})
							})
							return (
								<CustomNumberRangeFilter
									defaultValues={getSelectedValue(key) as [string, string]}
									filterLabel={name}
									minValue={min}
									maxValue={max}
									onFilterChanged={(min, max) => {
										filterRangedValues(key, [min.toString(), max.toString()])
									}}
									onTrackEvent={onTrackEvent}
								/>
							)
						}
					},
					onRenderColumnItem(item: ServiceAnswer) {
						const columnItemValue = getColumnItemValue(item, field, locale)
						if (field.type === ServiceFieldType.MultilineText) {
							return <ShortString text={columnItemValue} limit={50} />
						}
						return columnItemValue
					},
					isSortable: true,
					sortingFunction: field.type === ServiceFieldType.Date ? sortByDate : sortByAlphanumeric,
					sortingValue(item: ServiceAnswer) {
						if (field.type === ServiceFieldType.Date) {
							const answer = getRecordedFieldValue(item, field)
							return { date: answer?.value } // See '~utils/sorting'
						}

						return shorten(getColumnItemValue(item, field, locale))
					}
				})),
		[
			fields,
			hiddenFields,
			getSelectedValue,
			filterColumns,
			getStringValue,
			filterColumnTextValue,
			filterRangedValues,
			data,
			locale,
			onTrackEvent
		]
	)
}

function getColumnItemValue(
	answerItem: ServiceAnswer,
	field: ServiceField,
	locale: string
): string {
	const fieldInputs = field.inputs
	const answerField = getRecordedFieldValue(answerItem, field)

	if (!answerField) return ''

	if (Array.isArray(answerField.values)) {
		// map back to service field inputs
		return answerField.values.map((v) => fieldInputs.find((f) => f.id === v)?.label).join(', ')
	}

	switch (field.type) {
		case ServiceFieldType.SingleChoice:
			return answerField?.value ? fieldInputs.find((fi) => fi.id === answerField.value)?.label : ''
		case ServiceFieldType.Date:
			return answerField.value ? new Date(answerField.value).toLocaleDateString(locale) : ''
		default:
			return answerField.value
	}
}
