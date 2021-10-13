/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import {
	Contact,
	Service,
	ServiceAnswers,
	ServiceCustomField
} from '@cbosuite/schema/dist/client-types'
import {
	PaginatedTable as PaginatedList,
	IPaginatedListColumn
} from '~components/ui/PaginatedTable'
import cx from 'classnames'
import { OptionType } from '~ui/ReactSelect'
import { IDropdownOption } from '@fluentui/react'
import { wrap } from '~utils/appinsights'
import { Parser } from 'json2csv/dist/json2csv.umd'
import { useTranslation } from '~hooks/useTranslation'
import { useLocale } from '~hooks/useLocale'
import { DeleteServiceRecordModal } from '~components/ui/DeleteServiceRecordModal'
import { Panel } from '~components/ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { FormGenerator } from '~components/ui/FormGenerator'
import { downloadFile } from '~utils/downloadFile'
import { useActiveClients, useActiveServices, useReportListOptions } from './hooks'
import { IFieldFilter, ReportTypes } from './types'
import { ReportManager } from './ReportManager'
import { empty } from '~utils/noop'
import { useClientPageColumnsBuilder } from './useClientPageColumnsBuilder'
import { useServicePageColumnsBuilder } from './useServicePageColumnsBuilder'
import { FilterOptions, ReportOptions } from './ReportOptions'

interface ReportListProps {
	title?: string
}

export const ReportList: StandardFC<ReportListProps> = wrap(function ReportList({ title }) {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()
	const [recordToDelete, setRecordToDelete] = useState<
		{ record: ServiceAnswers; serviceId: string } | undefined
	>()
	const [recordToEdit, setRecordToEdit] = useState<
		{ service: Service; record: ServiceAnswers } | undefined
	>()
	const [showModal, setShowModal] = useState(false)
	const [isEditRecordOpen, { setTrue: openEditRecordPanel, setFalse: dismissEditRecordPanel }] =
		useBoolean(false)

	// paginated list state
	const [reportType, setReportType] = useState<ReportTypes | null>(null)
	const mgr = useMemo(() => new ReportManager(), [])

	const [filteredDataList, setFilteredDataList] = useState<unknown[]>(empty)
	const [pageColumns, setPageColumns] = useState<IPaginatedListColumn[]>(empty)
	const [reportFilterOption, setReportFilterOption] = useState<FilterOptions | undefined>(undefined)
	const [reportHeaderFilters, setReportHeaderFilters] = useState<IFieldFilter[]>(empty)
	const activeClients = useActiveClients()
	const { activeServices, isServicesLoading, deleteServiceAnswer, updateServiceAnswer } =
		useActiveServices()

	const clientPreload = useRef<{ pageColumns: IPaginatedListColumn[] }>({ pageColumns: [] })
	const servicePreload = useRef<{
		pageColumns: IPaginatedListColumn[]
		service: Service | undefined
	}>({ pageColumns: [], service: undefined })

	// #region Report filter functions
	const filterServiceHelper = useCallback(
		(
			serviceAnswers: ServiceAnswers[],
			filterId: string,
			filterValue: string | string[] | number | number[],
			fieldType?: string
		): ServiceAnswers[] => {
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
		},
		[]
	)
	const filterClientHelper = useCallback(
		(filteredContacts: Contact[], filterId: string, filterValue: string | string[]): Contact[] => {
			let tempList = []
			if (filterId === 'dateOfBirth') {
				tempList = filteredContacts.filter((contact) => {
					const [_from, _to] = filterValue as string[]
					const from = _from ? new Date(_from) : undefined
					const to = _to ? new Date(_to) : undefined
					const birthdate = new Date(contact.dateOfBirth)
					birthdate.setHours(0, 0, 0, 0)

					return (!from && !to) ||
						(from && to && birthdate >= from && birthdate <= to) ||
						(!from && birthdate <= to) ||
						(from && !to && birthdate >= from)
						? true
						: false
				})
			} else if (filterId === 'name') {
				const searchStr = filterValue[0]
				if (searchStr === '') {
					return filteredContacts
				}

				tempList = filteredContacts.filter((contact) => {
					const fullName = `${contact.name.first} ${contact.name.last}`
					return fullName.toLowerCase().includes(searchStr.toLowerCase())
				})
			} else if ((['city', 'county', 'state', 'zip'] as string[]).includes(filterId)) {
				const searchStr = filterValue[0]
				if (searchStr === '') {
					return filteredContacts
				}

				tempList = filteredContacts.filter((contact) => {
					const contactProp = contact?.address?.[filterId] || ' '
					return contactProp?.toLowerCase().includes(searchStr.toLowerCase())
				})
			} else {
				tempList = filteredContacts.filter((contact) =>
					filterValue.includes(contact.demographics[filterId])
				)
			}
			return tempList
		},
		[]
	)
	const filterColumns = useCallback(
		(columnId: string, option: IDropdownOption) => {
			const fieldIndex = mgr.filters.findIndex((f) => f.id === columnId)
			if (option.selected) {
				const newFilters = [...mgr.filters]
				if (!newFilters[fieldIndex]?.value.includes(option.key as string)) {
					newFilters[fieldIndex]?.value.push(option.key as string)
				}
				setReportHeaderFilters(newFilters)
			} else {
				const newFilters = [...mgr.filters]
				const optionIndex = newFilters[fieldIndex]?.value.indexOf(option.key as string)
				if (optionIndex > -1) {
					newFilters[fieldIndex]?.value.splice(optionIndex, 1)
				}
				setReportHeaderFilters(newFilters)
			}
		},
		[mgr]
	)
	const filterRangedValues = useCallback(
		(key: string, value: string[]) => {
			const newFilters = [...mgr.filters]
			newFilters[mgr.filters.findIndex((f) => f.id === key)].value = value
			setReportHeaderFilters(newFilters)
		},
		[mgr]
	)
	const filterColumnTextValue = useCallback(
		(key: string, value: string) => {
			filterRangedValues(key, [value])
		},
		[filterRangedValues]
	)
	const getDemographicValue = useCallback(
		(demographicKey: string, contact: Contact): string => {
			switch (contact?.demographics?.[demographicKey]) {
				case '':
				case 'unknown':
					return ''
				case 'other':
					const otherKey = `${demographicKey}Other`
					return contact?.demographics?.[otherKey]
				default:
					return t(
						`demographics.${demographicKey}.options.${contact?.demographics?.[demographicKey]}`
					)
			}
		},
		[t]
	)

	useEffect(() => {
		if (!reportHeaderFilters.some(({ value }) => value.length > 0)) {
			setFilteredDataList(mgr.unfilteredData)
		} else {
			let _filteredAnswers = mgr.unfilteredData
			reportHeaderFilters.forEach((filter) => {
				if (filter.value.length > 0) {
					if (reportType === ReportTypes.SERVICES) {
						_filteredAnswers = filterServiceHelper(
							_filteredAnswers as ServiceAnswers[],
							filter.id,
							filter.value,
							filter.fieldType
						)
					}
					if (reportType === ReportTypes.CLIENTS) {
						_filteredAnswers = filterClientHelper(
							_filteredAnswers as Contact[],
							filter.id,
							filter.value
						)
					}
				}
				setFilteredDataList(_filteredAnswers)
			})
		}
	}, [reportHeaderFilters, filterClientHelper, filterServiceHelper, reportType, mgr])
	// #endregion Report filter functions

	// #region Service Report functions
	async function handleUpdateServiceAnswer(values) {
		const res = await updateServiceAnswer({ ...values, answerId: recordToEdit.record.id })

		if (res) {
			const selectedService = activeServices.find((s) => s.id === recordToEdit.service.id)
			mgr.unfilteredData = selectedService.answers

			const currentAnswers = [...filteredDataList] as ServiceAnswers[]
			const newAnswers = currentAnswers.map((a) => {
				if (a.id === recordToEdit.record.id) {
					return { ...a, fieldAnswers: values.fieldAnswers }
				}
				return a
			})
			setFilteredDataList(newAnswers)

			dismissEditRecordPanel()
		}
	}

	const handleEditServiceAnswerAction = (service: Service, record: ServiceAnswers) => {
		setRecordToEdit({ service, record })
		openEditRecordPanel()
	}
	const handleDeleteServiceAnswerAction = (service: Service, record: ServiceAnswers) => {
		// Save the record to delete and open the confirmation modal
		setRecordToDelete({ record: record, serviceId: service.id })
		setShowModal(true)
	}

	const handleConfirmDelete = useCallback(async () => {
		// delete the record from the drilled down list
		const currentAnswers = [...filteredDataList] as ServiceAnswers[]
		const newAnswers = currentAnswers.filter((answer) => answer.id !== recordToDelete.record.id)
		setFilteredDataList(newAnswers)

		const res = await deleteServiceAnswer({
			serviceId: recordToDelete.serviceId,
			answerId: recordToDelete.record.id
		})

		if (res) {
			// delete the record from the unfiltered list
			const selectedService = activeServices.find((s) => s.id === recordToDelete.serviceId)
			mgr.unfilteredData = selectedService.answers.filter((a) => a.id !== recordToDelete.record.id)
		}

		// Hide modal
		setShowModal(false)
	}, [deleteServiceAnswer, filteredDataList, activeServices, recordToDelete, mgr])

	const buildServiceFilters = useCallback((service: Service): IFieldFilter[] => {
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
	}, [])

	const buildServicePageColumns = useServicePageColumnsBuilder(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		handleEditServiceAnswerAction,
		handleDeleteServiceAnswerAction
	)

	const buildServiceCSVFields = useCallback(
		(service: Service) => {
			const customFields = service.customFields

			const getColumnItemValue = (
				answerItem: ServiceAnswers,
				field: ServiceCustomField
			): string => {
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

			mgr.csvFields = customFields.map((field) => {
				return {
					label: field.fieldName,
					value: (item: ServiceAnswers) => {
						return getColumnItemValue(item, field)
					}
				}
			})

			if (service.contactFormEnabled) {
				mgr.csvFields.unshift(
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
		},
		[t, getDemographicValue, locale, mgr]
	)

	const loadSelectedService = useCallback(
		(serviceId: string) => {
			if (!serviceId) {
				setFilteredDataList([])
				setReportHeaderFilters([])
				mgr.filters = []
				mgr.unfilteredData = []
				servicePreload.current = {
					service: undefined,
					pageColumns: []
				}
			} else {
				setReportType(ReportTypes.SERVICES)
				const selectedService = activeServices.find((s) => s.id === serviceId)

				// store unfiltered answers for drill-down filtering
				mgr.unfilteredData = selectedService?.answers || []

				servicePreload.current = {
					service: selectedService,
					pageColumns: buildServicePageColumns(selectedService)
				}
				setFilteredDataList(mgr.unfilteredData)

				mgr.filters = buildServiceFilters(selectedService)
			}
		},
		[activeServices, buildServicePageColumns, buildServiceFilters, setReportType, mgr]
	)
	// #endregion Service Report functions

	// #region Client Report functions
	const buildClientCSVFields = useCallback(() => {
		mgr.csvFields = [
			{
				label: t('clientList.columns.name'),
				value: (item: Contact) => {
					return `${item?.name?.first} ${item?.name?.last}`
				}
			},
			{
				label: t('demographics.gender.label'),
				value: (item: Contact) => getDemographicValue('gender', item)
			},
			{
				label: t('demographics.race.label'),
				value: (item: Contact) => getDemographicValue('race', item)
			},
			{
				label: t('demographics.ethnicity.label'),
				value: (item: Contact) => getDemographicValue('ethnicity', item)
			},
			{
				label: t('customFilters.birthdate'),
				value: (item: Contact) => new Date(item.dateOfBirth).toLocaleDateString(locale)
			},
			{
				label: t('customFilters.city'),
				value: (item: Contact) => item?.address?.city
			},
			{
				label: t('customFilters.state'),
				value: (item: Contact) => item?.address?.state
			},
			{
				label: t('customFilters.zip'),
				value: (item: Contact) => item?.address?.zip
			}
		]
	}, [locale, t, getDemographicValue, mgr])

	const buildClientPageColumns = useClientPageColumnsBuilder(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue
	)

	const buildClientFilters = useCallback((): IFieldFilter[] => {
		const headerFilters: IFieldFilter[] = []
		const clientFilters = [
			'name',
			'gender',
			'race',
			'ethnicity',
			'dateOfBirth',
			'city',
			'county',
			'state',
			'zip'
		]
		clientFilters.forEach((filter) => {
			headerFilters.push({
				id: filter,
				name: filter,
				fieldType: 'clientField',
				value: []
			})
		})

		return headerFilters
	}, [])

	const loadClients = useCallback(() => {
		mgr.unfilteredData = activeClients
		setFilteredDataList(mgr.unfilteredData)

		const clientsPageColumns = buildClientPageColumns()
		setPageColumns(clientsPageColumns)
		buildClientCSVFields()
		mgr.filters = buildClientFilters()
	}, [
		mgr,
		activeClients,
		buildClientPageColumns,
		buildClientCSVFields,
		buildClientFilters,
		setPageColumns
	])
	// #endregion Client Report functions

	const unloadReportData = useCallback(() => {
		setFilteredDataList(empty)
		setPageColumns(empty)
		setReportHeaderFilters(empty)
		setReportFilterOption(undefined)
		mgr.reset()
	}, [mgr])

	const loadReportData = useCallback(
		(value: ReportTypes) => {
			unloadReportData()
			setReportType(value)
			mgr.isInitialLoad = false

			if (value === ReportTypes.SERVICES) {
				// Add a new filter option for picking the service
				setReportFilterOption({
					options: activeServices.map((service) => ({
						label: service.name,
						value: service.id
					})),
					// load the selected service data when it's selected
					onChange: (option: OptionType) => loadSelectedService(option?.value)
				})
			} else if (value === ReportTypes.CLIENTS) {
				setReportFilterOption(undefined)
				loadClients()
			}
		},
		[activeServices, loadSelectedService, loadClients, unloadReportData, mgr]
	)

	const reportListOptions = useReportListOptions()
	clientPreload.current.pageColumns = buildClientPageColumns()

	useEffect(() => {
		if (mgr.isInitialLoad && !isServicesLoading) {
			setPageColumns(clientPreload.current.pageColumns)
		}
	}, [activeClients, mgr, isServicesLoading, clientPreload])

	useEffect(() => {
		buildClientCSVFields()
	}, [activeClients, buildClientCSVFields])

	useEffect(() => {
		if (mgr.isInitialLoad && !reportType && !isServicesLoading) {
			loadReportData(ReportTypes.CLIENTS)
		}
	}, [mgr, reportType, loadReportData, isServicesLoading])

	useEffect(() => {
		if (reportType === ReportTypes.SERVICES) {
			setPageColumns(servicePreload.current.pageColumns)
			if (servicePreload.current.service !== undefined) {
				buildServiceCSVFields(servicePreload.current.service)
			}
		}
	}, [filteredDataList, reportType, buildServiceCSVFields])

	const downloadCSV = useCallback(
		function downloadCSV() {
			const csvParser = new Parser({ fields: mgr.csvFields })
			const csv = csvParser.parse(filteredDataList)
			const csvData = new Blob([csv], { type: 'text/csv' })
			const csvURL = URL.createObjectURL(csvData)
			downloadFile(csvURL)
		},
		[filteredDataList, mgr.csvFields]
	)

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.serviceList, 'reportList')}>
				<ReportOptions
					title={title}
					reportOptions={reportListOptions}
					onReportOptionChange={loadReportData}
					filterOptions={reportFilterOption}
					reportOptionsDefaultInputValue={t('clientsTitle')}
					showExportButton={pageColumns.length > 0}
					onExportDataButtonClick={downloadCSV}
				/>
				<PaginatedList
					className={styles.reportList}
					list={filteredDataList}
					itemsPerPage={20}
					columns={pageColumns}
					tableClassName={styles.reportTable}
					headerRowClassName={styles.headerRow}
					bodyRowClassName={styles.bodyRow}
					paginatorContainerClassName={styles.paginatorContainer}
					isLoading={isServicesLoading}
					exportButtonName={t('exportButton')}
				/>
				<DeleteServiceRecordModal
					showModal={showModal}
					onSubmit={handleConfirmDelete}
					onDismiss={() => setShowModal(false)}
				/>
			</div>
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
