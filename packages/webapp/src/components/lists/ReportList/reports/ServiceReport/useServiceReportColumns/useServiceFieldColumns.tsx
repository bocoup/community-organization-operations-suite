/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswer, ServiceField, ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { useCallback, useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { IPaginatedTableColumn } from '~components/ui/PaginatedTable'
import styles from '../../../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { IDropdownOption } from '@fluentui/react'
import { CustomNumberRangeFilter } from '~components/ui/CustomNumberRangeFilter'
import { ShortString } from '~components/ui/ShortString'
import { useLocale } from '~hooks/useLocale'
import { getRecordedFieldValue } from '~utils/forms'

export function useServiceFieldColumns(
	data: unknown[],
	fields: ServiceField[],
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void
): IPaginatedTableColumn[] {
	const [locale] = useLocale()

	const getColumnItemValue = useCallback(
		function getColumnItemValue(answerItem: ServiceAnswer, field: ServiceField): string {
			let answerValue = ''
			const fieldInputs = field.inputs
			const answerField = getRecordedFieldValue(answerItem, field)
			if (answerField) {
				if (Array.isArray(answerField.values)) {
					// map back to service field inputs
					answerValue = answerField.values
						.map((v) => fieldInputs.find((f) => f.id === v)?.label)
						.join(', ')
				} else {
					switch (field.type) {
						case ServiceFieldType.SingleChoice:
							answerValue = fieldInputs.find((fi) => fi.id === answerField.value)?.label
							break
						case ServiceFieldType.Date:
							answerValue = new Date(answerField.value).toLocaleDateString(locale)
							break
						default:
							answerValue = answerField.value
					}
				}
			} else {
				answerValue = ''
			}
			return answerValue
		},
		[locale]
	)

	return useMemo(
		() =>
			fields.map((field, index) => ({
				key: field.id,
				name: field.name,
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				onRenderColumnHeader(key, name) {
					const dropdownFieldTypes = [ServiceFieldType.SingleChoice, ServiceFieldType.MultiChoice]
					if (dropdownFieldTypes.includes(field.type)) {
						return (
							<CustomOptionsFilter
								filterLabel={name}
								placeholder={name}
								options={field.inputs.map((value) => ({ key: value.id, text: value.label }))}
								onFilterChanged={(option) => filterColumns(key, option)}
							/>
						)
					}

					const textFieldFieldTypes = [ServiceFieldType.SingleText, ServiceFieldType.MultilineText]
					if (textFieldFieldTypes.includes(field.type)) {
						return (
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						)
					}

					if (field.type === ServiceFieldType.Date) {
						return (
							<CustomDateRangeFilter
								filterLabel={name}
								onFilterChanged={({ startDate, endDate }) => {
									const sDate = startDate ? startDate.toISOString() : ''
									const eDate = endDate ? endDate.toISOString() : ''
									filterRangedValues(key, [sDate, eDate])
								}}
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
								filterLabel={name}
								minValue={min}
								maxValue={max}
								onFilterChanged={(min, max) => {
									filterRangedValues(key, [min.toString(), max.toString()])
								}}
							/>
						)
					}
				},
				onRenderColumnItem(item: ServiceAnswer) {
					const columnItemValue = getColumnItemValue(item, field)
					if (field.type === ServiceFieldType.MultilineText) {
						return <ShortString text={columnItemValue} limit={50} />
					}
					return columnItemValue
				}
			})),
		[data, fields, filterColumns, filterColumnTextValue, filterRangedValues, getColumnItemValue]
	)
}
