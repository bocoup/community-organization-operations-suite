/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import {
	Contact,
	Service,
	ServiceAnswers,
	ServiceCustomField
} from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { IMultiActionButtons, MultiActionButton } from '~components/ui/MultiActionButton2'
import { IPaginatedTableColumn } from '~components/ui/PaginatedTable'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { useTranslation } from '~hooks/useTranslation'
import styles from '../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { IDropdownOption } from '@fluentui/react'
import { CustomNumberRangeFilter } from '~components/ui/CustomNumberRangeFilter'
import { ShortString } from '~components/ui/ShortString'
import { useLocale } from '~hooks/useLocale'

export function useServicePageColumns(
	service: Service,
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	handleEdit: (service: Service, record: ServiceAnswers) => void,
	handleDelete: (service: Service, record: ServiceAnswers) => void
) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()
	return useMemo((): IPaginatedTableColumn[] => {
		const customFields = service.customFields ?? []

		const getColumnItemValue = (answerItem: ServiceAnswers, field: ServiceCustomField): string => {
			let answerValue = ''

			const answers = answerItem.fieldAnswers[field.fieldType]?.find(
				(a) => a.fieldId === field.fieldId
			)
			if (answers) {
				const fieldValue = customFields.find((f) => f.fieldId === answers.fieldId).fieldValue

				if (Array.isArray(answers.values)) {
					answerValue = answers.values
						.map((v) => fieldValue.find((f) => f.id === v).label)
						.join(', ')
				} else {
					switch (field.fieldType) {
						case 'singleChoice':
							answerValue = fieldValue.find((f) => f.id === answers.values).label
							break
						case 'date':
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
					onRenderColumnItem(item: ServiceAnswers, index: number) {
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
					onRenderColumnItem(item: ServiceAnswers, index: number) {
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
					onRenderColumnItem(item: ServiceAnswers, index: number) {
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
					onRenderColumnItem(item: ServiceAnswers, index: number) {
						return getDemographicValue('ethnicity', item.contacts[0])
					}
				}
			)
		}

		const customFormColumns: IPaginatedTableColumn[] = customFields.map((field, index) => ({
			key: field.fieldId,
			name: field.fieldName,
			headerClassName: styles.headerItemCell,
			itemClassName: styles.itemCell,
			onRenderColumnHeader(key, name) {
				const dropdownFieldTypes = ['singleChoice', 'multiChoice']
				if (dropdownFieldTypes.includes(field.fieldType)) {
					return (
						<CustomOptionsFilter
							filterLabel={name}
							placeholder={name}
							options={field.fieldValue.map((value) => ({ key: value.id, text: value.label }))}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				}

				const textFieldFieldTypes = ['singleText', 'multilineText']
				if (textFieldFieldTypes.includes(field.fieldType)) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				}

				if (field.fieldType === 'date') {
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

				if (field.fieldType === 'number') {
					// get min and max values from service answers
					let min = 0
					let max = 0
					service.answers.forEach((answer) => {
						answer.fieldAnswers[field.fieldType]?.forEach((fieldAnswer) => {
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
			onRenderColumnItem(item: ServiceAnswers) {
				if (field.fieldType === 'multilineText') {
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
				onRenderColumnItem(item: ServiceAnswers) {
					const columnActionButtons: IMultiActionButtons<ServiceAnswers>[] = [
						{
							name: t('serviceListRowActions.edit'),
							className: cx(styles.editButton),
							onActionClick(record) {
								handleEdit(service, record)
							}
						},
						{
							name: t('serviceListRowActions.delete'),
							className: cx(styles.editButton),
							onActionClick(record) {
								handleDelete(service, record)
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
		handleDelete
	])
}
