/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import {
	Contact,
	Service,
	ServiceAnswer,
	ServiceField,
	ServiceFieldType
} from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { IMultiActionButtons, MultiActionButton } from '~components/ui/MultiActionButton2'
import { IPaginatedTableColumn } from '~components/ui/PaginatedTable'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { useTranslation } from '~hooks/useTranslation'
import styles from '../../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { IDropdownOption } from '@fluentui/react'
import { CustomNumberRangeFilter } from '~components/ui/CustomNumberRangeFilter'
import { ShortString } from '~components/ui/ShortString'
import { useLocale } from '~hooks/useLocale'

export function useServiceReportColumns(
	service: Service,
	data: unknown[],
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	handleEdit: (record: ServiceAnswer) => void,
	handleDelete: (record: ServiceAnswer) => void
) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()
	return useMemo((): IPaginatedTableColumn[] => {
		const customFields = service.fields ?? []

		const getColumnItemValue = (answerItem: ServiceAnswer, field: ServiceField): string => {
			let answerValue = ''

			const answers = answerItem.fields.find((a) => a.fieldId === field.id)
			if (answers) {
				const fieldValue = customFields.find((f) => f.id === answers.fieldId).inputs

				if (Array.isArray(answers.values)) {
					answerValue = answers.values
						.map((v) => fieldValue.find((f) => f.id === v).label)
						.join(', ')
				} else {
					switch (field.type) {
						case ServiceFieldType.SingleChoice:
							answerValue = fieldValue.find((f) => f.id === answers.fieldId).label
							break
						case ServiceFieldType.Date:
							answerValue = new Date(answers.values).toLocaleDateString(locale)
							break
						default:
							answerValue = answers.values
					}
				}
			} else {
				answerValue = ''
			}

			return answerValue
		}

		const _pageColumns: IPaginatedTableColumn[] = []

		if (service.contactFormEnabled) {
			_pageColumns.push(
				{
					key: 'name',
					headerClassName: styles.headerItemCell,
					itemClassName: styles.itemCell,
					name: t('clientList.columns.name'),
					onRenderColumnHeader(key, name, index) {
						return (
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						)
					},
					onRenderColumnItem(item: ServiceAnswer, index: number) {
						return `${item?.contacts[0]?.name?.first} ${item?.contacts[0]?.name?.last}`
					}
				},
				{
					key: 'gender',
					headerClassName: styles.headerItemCell,
					itemClassName: styles.itemCell,
					name: t('demographics.gender.label'),
					onRenderColumnHeader(key, name, index) {
						return (
							<CustomOptionsFilter
								filterLabel={name}
								placeholder={name}
								options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
									key: o.key,
									text: t(`demographics.${key}.options.${o.key}`)
								}))}
								onFilterChanged={(option) => filterColumns(key, option)}
							/>
						)
					},
					onRenderColumnItem(item: ServiceAnswer, index: number) {
						return getDemographicValue('gender', item.contacts[0])
					}
				},
				{
					key: 'race',
					headerClassName: styles.headerItemCell,
					itemClassName: styles.itemCell,
					name: t('demographics.race.label'),
					onRenderColumnHeader(key, name, index) {
						return (
							<CustomOptionsFilter
								filterLabel={name}
								placeholder={name}
								options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
									key: o.key,
									text: t(`demographics.${key}.options.${o.key}`)
								}))}
								onFilterChanged={(option) => filterColumns(key, option)}
							/>
						)
					},
					onRenderColumnItem(item: ServiceAnswer, index: number) {
						return getDemographicValue('race', item.contacts[0])
					}
				},
				{
					key: 'ethnicity',
					headerClassName: styles.headerItemCell,
					itemClassName: styles.itemCell,
					name: t('demographics.ethnicity.label'),
					onRenderColumnHeader(key, name, index) {
						return (
							<CustomOptionsFilter
								filterLabel={name}
								placeholder={name}
								options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
									key: o.key,
									text: t(`demographics.${key}.options.${o.key}`)
								}))}
								onFilterChanged={(option) => filterColumns(key, option)}
							/>
						)
					},
					onRenderColumnItem(item: ServiceAnswer, index: number) {
						return getDemographicValue('ethnicity', item.contacts[0])
					}
				}
			)
		}

		const customFormColumns: IPaginatedTableColumn[] = customFields.map((field, index) => ({
			key: field.id,
			name: field.name,
			headerClassName: styles.headerItemCell,
			itemClassName: styles.itemCell,
			onRenderColumnHeader(key, name) {
				const dropdownFieldTypes = ['singleChoice', 'multiChoice']
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
				if (field.type === ServiceFieldType.MultilineText) {
					return <ShortString text={getColumnItemValue(item, field)} limit={50} />
				}
				return getColumnItemValue(item, field)
			}
		}))

		const actionColumns: IPaginatedTableColumn[] = [
			{
				key: 'actions',
				name: '',
				headerClassName: cx(styles.headerItemCell, styles.actionItemHeader),
				itemClassName: cx(styles.itemCell, styles.actionItemCell),
				onRenderColumnItem(item: ServiceAnswer) {
					const columnActionButtons: IMultiActionButtons<ServiceAnswer>[] = [
						{
							name: t('serviceListRowActions.edit'),
							className: cx(styles.editButton),
							onActionClick(record) {
								handleEdit(record)
							}
						},
						{
							name: t('serviceListRowActions.delete'),
							className: cx(styles.editButton),
							onActionClick(record) {
								handleDelete(record)
							}
						}
					]
					return (
						<div className={styles.actionItemButtonsWrapper}>
							<MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
						</div>
					)
				}
			}
		]

		return _pageColumns.concat(customFormColumns).concat(actionColumns)
	}, [
		t,
		service,
		locale,
		filterColumnTextValue,
		filterRangedValues,
		filterColumns,
		getDemographicValue,
		handleEdit,
		handleDelete,
		data
	])
}
