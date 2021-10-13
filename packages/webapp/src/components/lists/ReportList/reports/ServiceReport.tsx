/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Service,
	ServiceAnswers,
	ServiceCustomField
} from '@cbosuite/schema/dist/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { FC, memo, useCallback, useEffect, useState } from 'react'
import { DeleteServiceRecordModal } from '~components/ui/DeleteServiceRecordModal'
import { FormGenerator } from '~components/ui/FormGenerator'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import { Panel } from '~components/ui/Panel'
import { useActiveServices } from '../hooks'
import { useServicePageColumns } from './useServicePageColumns'
import styles from '../index.module.scss'
import { CommonReportProps, FilterHelper } from './types'
import { empty } from '~utils/noop'
import { CsvField, IFieldFilter } from '../types'
import { useLocale } from '~hooks/useLocale'
import { useTranslation } from '~hooks/useTranslation'

export const ServiceReport: FC<CommonReportProps> = memo(function ClientReport({
	data,
	service,
	filterColumns,
	filterColumnTextValue,
	filterRangedValues,
	getDemographicValue,
	setFilteredData,
	setFilterHelper,
	setUnfilteredData,
	setCsvFields,
	setFieldFilters
}) {
	const { activeServices, isServicesLoading, deleteServiceAnswer, updateServiceAnswer } =
		useActiveServices()

	const [showModal, setShowModal] = useState(false)
	const [isEditRecordOpen, { setTrue: openEditRecordPanel, setFalse: dismissEditRecordPanel }] =
		useBoolean(false)
	const [recordToDelete, setRecordToDelete] = useState<
		{ record: ServiceAnswers; serviceId: string } | undefined
	>()
	const [recordToEdit, setRecordToEdit] = useState<
		{ service: Service; record: ServiceAnswers } | undefined
	>()

	const handleEditServiceAnswerAction = (service: Service, record: ServiceAnswers) => {
		setRecordToEdit({ service, record })
		openEditRecordPanel()
	}
	const handleDeleteServiceAnswerAction = (service: Service, record: ServiceAnswers) => {
		// Save the record to delete and open the confirmation modal
		setRecordToDelete({ record: record, serviceId: service.id })
		setShowModal(true)
	}
	async function handleUpdateServiceAnswer(values) {
		const res = await updateServiceAnswer({ ...values, answerId: recordToEdit.record.id })

		if (res) {
			const selectedService = activeServices.find((s) => s.id === recordToEdit.service.id)
			setUnfilteredData(selectedService.answers)

			const currentAnswers = [...data] as ServiceAnswers[]
			const newAnswers = currentAnswers.map((a) => {
				if (a.id === recordToEdit.record.id) {
					return { ...a, fieldAnswers: values.fieldAnswers }
				}
				return a
			})
			setFilteredData(newAnswers)

			dismissEditRecordPanel()
		}
	}

	const handleConfirmDelete = useCallback(async () => {
		// delete the record from the drilled down list
		const currentAnswers = [...data] as ServiceAnswers[]
		const newAnswers = currentAnswers.filter((answer) => answer.id !== recordToDelete.record.id)
		setFilteredData(newAnswers)

		const res = await deleteServiceAnswer({
			serviceId: recordToDelete.serviceId,
			answerId: recordToDelete.record.id
		})

		if (res) {
			// delete the record from the unfiltered list
			const selectedService = activeServices.find((s) => s.id === recordToDelete.serviceId)
			setUnfilteredData(selectedService.answers.filter((a) => a.id !== recordToDelete.record.id))
		}

		// Hide modal
		setShowModal(false)
	}, [
		deleteServiceAnswer,
		data,
		activeServices,
		recordToDelete,
		setFilteredData,
		setUnfilteredData
	])

	useServiceReportData(service, setUnfilteredData, setFilteredData)
	useServiceReportFilters(service, setFieldFilters)
	useServiceReportCsvFields(service, setCsvFields, getDemographicValue)
	useServiceReportFilterHelper(setFilterHelper)

	const columns = useServicePageColumns(
		service,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		handleEditServiceAnswerAction,
		handleDeleteServiceAnswerAction
	)

	return (
		<>
			<PaginatedTable
				className={styles.reportList}
				list={data}
				itemsPerPage={20}
				columns={columns}
				tableClassName={styles.reportTable}
				headerRowClassName={styles.headerRow}
				bodyRowClassName={styles.bodyRow}
				paginatorContainerClassName={styles.paginatorContainer}
				isLoading={isServicesLoading}
			/>
			<DeleteServiceRecordModal
				showModal={showModal}
				onSubmit={handleConfirmDelete}
				onDismiss={() => setShowModal(false)}
			/>
			<Panel openPanel={isEditRecordOpen} onDismiss={dismissEditRecordPanel}>
				<FormGenerator
					service={recordToEdit?.service}
					record={recordToEdit?.record}
					previewMode={false}
					editMode={true}
					onSubmit={(values) => handleUpdateServiceAnswer(values)}
				/>
			</Panel>
		</>
	)
})

function useServiceReportData(
	service: Service,
	setUnfilteredData: (data: unknown[]) => void,
	setFilteredData: (data: unknown[]) => void
) {
	const d = service.answers || empty
	setUnfilteredData(d)
	setFilteredData(d)
}

function useServiceReportFilters(
	service: Service,
	setFieldFilters: (filters: IFieldFilter[]) => void
) {
	useEffect(() => {
		setFieldFilters(buildServiceFilters(service))
	}, [service, setFieldFilters])
}

function useServiceReportCsvFields(
	service: Service,
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string
) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()

	useEffect(() => {
		const customFields = service.customFields
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

		const csvFields = customFields.map((field) => {
			return {
				label: field.fieldName,
				value: (item: ServiceAnswers) => {
					return getColumnItemValue(item, field)
				}
			}
		})

		if (service.contactFormEnabled) {
			csvFields.unshift(
				{
					label: t('clientList.columns.name'),
					value: (item: ServiceAnswers) => {
						return `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					}
				},
				{
					label: t('demographics.gender.label'),
					value: (item: ServiceAnswers) => getDemographicValue('gender', item.contacts[0])
				},
				{
					label: t('demographics.race.label'),
					value: (item: ServiceAnswers) => getDemographicValue('race', item.contacts[0])
				},
				{
					label: t('demographics.ethnicity.label'),
					value: (item: ServiceAnswers) => getDemographicValue('ethnicity', item.contacts[0])
				}
			)
		}
		setCsvFields(csvFields)
	}, [setCsvFields, getDemographicValue, t, locale, service])
}

function buildServiceFilters(service: Service): IFieldFilter[] {
	// build header filters
	const headerFilters: IFieldFilter[] = []
	service.customFields.forEach((field) => {
		headerFilters.push({
			id: field.fieldId,
			name: field.fieldName,
			fieldType: field.fieldType,
			value: []
		})
	})

	if (service.contactFormEnabled) {
		const serviceClientFilters = ['name', 'gender', 'race', 'ethnicity']
		serviceClientFilters.forEach((filter) => {
			headerFilters.push({
				id: filter,
				name: filter,
				fieldType: 'clientField',
				value: []
			})
		})
	}

	return headerFilters
}

function useServiceReportFilterHelper(setFilterHelper: (arg: { helper: FilterHelper }) => void) {
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
