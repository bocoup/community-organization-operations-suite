/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import {
	Contact,
	ContactStatus,
	Service,
	ServiceAnswers,
	ServiceCustomField,
	ServiceStatus
} from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { FilterOptions, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import ReactSelect, { OptionType } from '~ui/ReactSelect'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Col } from 'react-bootstrap'
import { wrap } from '~utils/appinsights'
import { Parser } from 'json2csv'
import { useTranslation } from '~hooks/useTranslation'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import CLIENT_DEMOGRAPHICS from '~utils/consts/CLIENT_DEMOGRAPHICS'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'
import { useContacts } from '~hooks/api/useContacts'
import { useLocale } from '~hooks/useLocale'
import DeleteServiceRecordModal from '~components/ui/DeleteServiceRecordModal'
import CustomDateRangeFilter from '~components/ui/CustomDateRangeFilter'
import CustomTextFieldFilter from '~components/ui/CustomTextFieldFilter'
import CustomNumberRangeFilter from '~components/ui/CustomNumberRangeFilter'

interface ReportListProps extends ComponentProps {
	title?: string
}

interface IFieldFilter {
	id: string
	name: string
	fieldType: string
	value: string[]
}

const filterStyles: Partial<IDropdownStyles> = {
	root: {
		overflowWrap: 'break-word',
		inlineSize: 'fit-content',
		marginTop: 10
	},
	callout: {
		minWidth: 'fit-content'
	},
	dropdown: {
		fontSize: 14,
		fontWeight: 600,
		border: 'none',
		':focus': {
			':after': {
				border: 'none'
			}
		}
	},
	title: {
		color: 'var(--bs-black)',
		border: 'none',
		paddingLeft: 14,
		paddingTop: 4,
		paddingBottom: 8,
		height: 'auto',
		lineHeight: 'unset',
		whiteSpace: 'break-spaces'
	},
	dropdownItemsWrapper: {
		border: '1px solid var(--bs-gray-4)',
		borderRadius: 4
	},
	dropdownItem: {
		fontSize: 12
	},
	dropdownItemSelected: {
		fontSize: 12
	},
	dropdownItemSelectedAndDisabled: {
		fontSize: 12
	},
	dropdownOptionText: {
		fontSize: 12
	},
	subComponentStyles: {
		label: {},
		panel: {},
		multiSelectItem: {
			checkbox: {
				borderColor: 'var(--bs-gray-4)'
			}
		}
	}
}

enum ReportTypes {
	SERVICES = 'services',
	CLIENTS = 'clients'
}

const ReportList = memo(function ReportList({ title }: ReportListProps): JSX.Element {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const [locale] = useLocale()
	const { orgId } = useCurrentUser()
	const { serviceList, loading, deleteServiceAnswer } = useServiceList(orgId)
	const { contacts } = useContacts()
	const [recordToDelete, setRecordToDelete] = useState<
		{ record: ServiceAnswers; serviceId: string } | undefined
	>()
	const [showModal, setShowModal] = useState(false)

	// paginated list state
	const [reportType, setReportType] = useState<ReportTypes | null>(null)
	const unfilteredList = useRef<ServiceAnswers[] | Contact[]>([])
	const [filteredList, setFilteredList] = useState<ServiceAnswers[] | Contact[]>([])
	const [pageColumns, setPageColumns] = useState<IPaginatedListColumn[]>([])
	const [reportFilterOption, setReportFilterOption] = useState<FilterOptions | undefined>(undefined)
	const [reportHeaderFilters, setReportHeaderFilters] = useState<IFieldFilter[]>([])
	const filters = useRef<IFieldFilter[]>([])
	const csvFields = useRef<{ label: string; value: (item: any) => string }[]>([])
	const activeServices = useRef<Service[]>(
		serviceList.filter((service) => service.serviceStatus !== ServiceStatus.Archive)
	)
	const activeClients = useRef<Contact[]>(
		contacts.filter((contact) => contact.status !== ContactStatus.Archived)
	)

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
			} else if ((['city', 'state', 'zip'] as string[]).includes(filterId)) {
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
			const fieldIndex = filters.current.findIndex((f) => f.id === columnId)
			if (option.selected) {
				const newFilters = [...filters.current]
				if (!newFilters[fieldIndex]?.value.includes(option.key as string)) {
					newFilters[fieldIndex]?.value.push(option.key as string)
				}
				setReportHeaderFilters(newFilters)
			} else {
				const newFilters = [...filters.current]
				const optionIndex = newFilters[fieldIndex]?.value.indexOf(option.key as string)
				if (optionIndex > -1) {
					newFilters[fieldIndex]?.value.splice(optionIndex, 1)
				}
				setReportHeaderFilters(newFilters)
			}
		},
		[filters]
	)
	const filterRangedValues = useCallback(
		(key: string, value: string[]) => {
			const newFilters = [...filters.current]
			newFilters[filters.current.findIndex((f) => f.id === key)].value = value
			setReportHeaderFilters(newFilters)
		},
		[filters]
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
			setFilteredList(unfilteredList.current)
		} else {
			let _filteredAnswers = unfilteredList.current
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
				setFilteredList(_filteredAnswers)
			})
		}
	}, [reportHeaderFilters, filterClientHelper, filterServiceHelper, reportType])
	// #endregion Report filter functions

	// #region Service Report functions
	const handleDeleteServiceAnswerAction = (serviceAnswer: ServiceAnswers, serviceId: string) => {
		// Save the record to delete and open the confirmation modal
		setRecordToDelete({ record: serviceAnswer, serviceId })
		setShowModal(true)
	}

	const handleConfirmDelete = useCallback(async () => {
		// delete the record from the drilled down list
		const currentAnswers = [...filteredList] as ServiceAnswers[]
		const newAnswers = currentAnswers.filter((answer) => answer.id !== recordToDelete.record.id)
		setFilteredList(newAnswers)

		const res = await deleteServiceAnswer({
			serviceId: recordToDelete.serviceId,
			answerId: recordToDelete.record.id
		})

		if (res) {
			// delete the record from the unfiltered list
			const selectedService = activeServices.current.find((s) => s.id === recordToDelete.serviceId)
			unfilteredList.current = selectedService.answers.filter(
				(a) => a.id !== recordToDelete.record.id
			)
		}

		// Hide modal
		setShowModal(false)
	}, [deleteServiceAnswer, filteredList, activeServices, recordToDelete])

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

	const buildServicePageColumns = useCallback(
		(service: Service): IPaginatedListColumn[] => {
			const customFields = service.customFields ?? []

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

			const _pageColumns: IPaginatedListColumn[] = []

			if (service.contactFormEnabled) {
				_pageColumns.push(
					{
						key: 'name',
						itemClassName: styles.columnRowItem,
						name: t('clientList.columns.name'),
						onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
							const columnKey = `${key}__${name.replace(/\W/g, '')}__${index}`
							return (
								<Col
									key={columnKey}
									className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
								>
									<CustomTextFieldFilter
										filterLabel={name}
										onFilterChanged={(value) => filterColumnTextValue(key, value)}
									/>
								</Col>
							)
						},
						onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers, index: number) {
							const fullname = `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
							return (
								<Col key={index} className={cx('g-0', styles.columnItem)}>
									{fullname}
								</Col>
							)
						}
					},
					{
						key: 'gender',
						itemClassName: styles.columnRowItem,
						name: t('demographics.gender.label'),
						onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
							return (
								<Col
									key={`${key}__${name}__${index}`}
									className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
								>
									<Dropdown
										placeholder={t('demographics.gender.label')}
										multiSelect
										options={CLIENT_DEMOGRAPHICS.gender.options.map((o) => ({
											key: o.key,
											text: t(`demographics.gender.options.${o.key}`)
										}))}
										styles={filterStyles}
										onRenderTitle={() => <>{t('demographics.gender.label')}</>}
										onRenderCaretDown={() => (
											<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
										)}
										onChange={(event, option) => {
											filterColumns('gender', option)
										}}
									/>
								</Col>
							)
						},
						onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers, index: number) {
							return (
								<Col key={index} className={cx('g-0', styles.columnItem)}>
									{getDemographicValue('gender', item.contacts[0])}
								</Col>
							)
						}
					},
					{
						key: 'race',
						itemClassName: styles.columnRowItem,
						name: t('demographics.race.label'),
						onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
							return (
								<Col
									key={`${key}__${name}__${index}`}
									className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
								>
									<Dropdown
										placeholder={t('demographics.race.label')}
										multiSelect
										options={CLIENT_DEMOGRAPHICS.race.options.map((o) => ({
											key: o.key,
											text: t(`demographics.race.options.${o.key}`)
										}))}
										styles={filterStyles}
										onRenderTitle={() => <>{t('demographics.race.label')}</>}
										onRenderCaretDown={() => (
											<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
										)}
										onChange={(event, option) => {
											filterColumns('race', option)
										}}
									/>
								</Col>
							)
						},
						onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers, index: number) {
							return (
								<Col key={index} className={cx('g-0', styles.columnItem)}>
									{getDemographicValue('race', item.contacts[0])}
								</Col>
							)
						}
					},
					{
						key: 'ethnicity',
						itemClassName: styles.columnRowItem,
						name: t('demographics.ethnicity.label'),
						onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
							return (
								<Col
									key={`${key}__${name}__${index}`}
									className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
								>
									<Dropdown
										placeholder={t('demographics.ethnicity.label')}
										multiSelect
										options={CLIENT_DEMOGRAPHICS.ethnicity.options.map((o) => ({
											key: o.key,
											text: t(`demographics.ethnicity.options.${o.key}`)
										}))}
										styles={filterStyles}
										onRenderTitle={() => <>{t('demographics.ethnicity.label')}</>}
										onRenderCaretDown={() => (
											<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
										)}
										onChange={(event, option) => {
											filterColumns('ethnicity', option)
										}}
									/>
								</Col>
							)
						},
						onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers, index: number) {
							return (
								<Col key={index} className={cx('g-0', styles.columnItem)}>
									{getDemographicValue('ethnicity', item.contacts[0])}
								</Col>
							)
						}
					}
				)
			}

			const customFormColumns: IPaginatedListColumn[] = customFields.map((field, index) => ({
				key: field.fieldId,
				name: field.fieldName,
				itemClassName: styles.columnRowItem,
				onRenderColumnHeader: function renderColumnHeader(key, name) {
					const dropdownFieldTypes = ['singleChoice', 'multiChoice']
					if (dropdownFieldTypes.includes(field.fieldType)) {
						return (
							<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
								<Dropdown
									placeholder={name}
									multiSelect
									options={field.fieldValue.map((value) => ({ key: value.id, text: value.label }))}
									styles={filterStyles}
									onRenderTitle={() => <>{name}</>}
									onRenderCaretDown={() => (
										<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
									)}
									onChange={(event, option) => filterColumns(key, option)}
								/>
							</Col>
						)
					}

					const textFieldFieldTypes = ['singleText', 'multilineText']
					if (textFieldFieldTypes.includes(field.fieldType)) {
						return (
							<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
								<CustomTextFieldFilter
									filterLabel={name}
									onFilterChanged={(value) => filterColumnTextValue(key, value)}
								/>
							</Col>
						)
					}

					if (field.fieldType === 'date') {
						return (
							<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
								<CustomDateRangeFilter
									filterLabel={name}
									onFilterChanged={({ startDate, endDate }) => {
										const sDate = startDate ? startDate.toISOString() : ''
										const eDate = endDate ? endDate.toISOString() : ''
										filterRangedValues(key, [sDate, eDate])
									}}
								/>
							</Col>
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
							<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
								<CustomNumberRangeFilter
									filterLabel={name}
									minValue={min}
									maxValue={max}
									onFilterChanged={(min, max) => {
										filterRangedValues(key, [min.toString(), max.toString()])
									}}
								/>
							</Col>
						)
					}
				},
				onRenderColumnItem: function renderColumnItem(item: ServiceAnswers) {
					const answerValue = getColumnItemValue(item, field)
					return (
						<Col key={`row-${index}`} className={cx('g-0', styles.columnItem)}>
							{answerValue}
						</Col>
					)
				}
			}))

			const actionColumns: IPaginatedListColumn[] = [
				{
					key: 'actions',
					name: '',
					className: cx('d-flex justify-content-end', styles.columnActionRowHeader),
					itemClassName: styles.columnActionRowItem,
					onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
						const columnActionButtons: IMultiActionButtons<ServiceAnswers>[] = [
							{
								name: t('serviceListRowActions.delete'),
								className: cx(styles.editButton),
								onActionClick: function deleteRecord(item) {
									handleDeleteServiceAnswerAction(item, service.id)
								}
							}
						]
						return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
					}
				}
			]

			return _pageColumns.concat(customFormColumns).concat(actionColumns)
		},
		[t, locale, filterColumnTextValue, filterRangedValues, filterColumns, getDemographicValue]
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

			csvFields.current = customFields.map((field) => {
				return {
					label: field.fieldName,
					value: (item: ServiceAnswers) => {
						return getColumnItemValue(item, field)
					}
				}
			})

			if (service.contactFormEnabled) {
				csvFields.current.unshift(
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
		[t, getDemographicValue, locale]
	)

	const loadSelectedService = useCallback(
		(serviceId: string) => {
			if (!serviceId) {
				setFilteredList([])
				setPageColumns([])
				setReportHeaderFilters([])
				filters.current = []
				unfilteredList.current = []
			} else {
				const selectedService = activeServices.current.find((s) => s.id === serviceId)

				// store unfiltered answers for drill-down filtering
				unfilteredList.current = selectedService?.answers || []

				const servicePageColumns = buildServicePageColumns(selectedService)
				setPageColumns(servicePageColumns)
				setFilteredList(unfilteredList.current)
				buildServiceCSVFields(selectedService)

				filters.current = buildServiceFilters(selectedService)
			}
		},
		[activeServices, buildServicePageColumns, buildServiceFilters, buildServiceCSVFields]
	)
	// #endregion Service Report functions

	// #region Client Report functions
	const buildClientCSVFields = useCallback(() => {
		csvFields.current = [
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
	}, [locale, t, getDemographicValue])

	const buildClientPageColumns = useCallback((): IPaginatedListColumn[] => {
		const _pageColumns: IPaginatedListColumn[] = [
			{
				key: 'name',
				itemClassName: styles.columnRowItem,
				name: t('clientList.columns.name'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					const columnKey = `${key}__${name.replace(/\W/g, '')}__${index}`
					return (
						<Col key={columnKey} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const fullname = `${item.name.first} ${item.name.last}`
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{fullname}
						</Col>
					)
				}
			},
			{
				key: 'gender',
				itemClassName: styles.columnRowItem,
				name: t('demographics.gender.label'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
						>
							<Dropdown
								placeholder={t('demographics.gender.label')}
								multiSelect
								options={CLIENT_DEMOGRAPHICS.gender.options.map((o) => ({
									key: o.key,
									text: t(`demographics.gender.options.${o.key}`)
								}))}
								styles={filterStyles}
								onRenderTitle={() => <>{t('demographics.gender.label')}</>}
								onRenderCaretDown={() => (
									<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
								)}
								onChange={(event, option) => {
									filterColumns('gender', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{getDemographicValue('gender', item)}
						</Col>
					)
				}
			},
			{
				key: 'race',
				itemClassName: styles.columnRowItem,
				name: t('demographics.race.label'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
						>
							<Dropdown
								placeholder={t('demographics.race.label')}
								multiSelect
								options={CLIENT_DEMOGRAPHICS.race.options.map((o) => ({
									key: o.key,
									text: t(`demographics.race.options.${o.key}`)
								}))}
								styles={filterStyles}
								onRenderTitle={() => <>{t('demographics.race.label')}</>}
								onRenderCaretDown={() => (
									<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
								)}
								onChange={(event, option) => {
									filterColumns('race', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{getDemographicValue('race', item)}
						</Col>
					)
				}
			},
			{
				key: 'ethnicity',
				itemClassName: styles.columnRowItem,
				name: t('demographics.ethnicity.label'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
						>
							<Dropdown
								placeholder={t('demographics.ethnicity.label')}
								multiSelect
								options={CLIENT_DEMOGRAPHICS.ethnicity.options.map((o) => ({
									key: o.key,
									text: t(`demographics.ethnicity.options.${o.key}`)
								}))}
								styles={filterStyles}
								onRenderTitle={() => <>{t('demographics.ethnicity.label')}</>}
								onRenderCaretDown={() => (
									<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
								)}
								onChange={(event, option) => {
									filterColumns('ethnicity', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{getDemographicValue('ethnicity', item)}
						</Col>
					)
				}
			},
			{
				key: 'dateOfBirth',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.birthdate'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					const birthDateLimit = new Date()
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
						>
							<CustomDateRangeFilter
								filterLabel={name}
								minStartDate={birthDateLimit}
								maxEndDate={birthDateLimit}
								onFilterChanged={({ startDate, endDate }) => {
									const sDate = startDate ? startDate.toISOString() : ''
									const eDate = endDate ? endDate.toISOString() : ''
									filterRangedValues(key, [sDate, eDate])
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{new Date(item.dateOfBirth).toLocaleDateString(locale)}
						</Col>
					)
				}
			},
			{
				key: 'city',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.city'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					const columnKey = `${key}__${name.replace(/\W/g, '')}__${index}`
					return (
						<Col key={columnKey} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const city = item?.address?.city
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{city}
						</Col>
					)
				}
			},
			{
				key: 'state',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.state'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					const columnKey = `${key}__${name.replace(/\W/g, '')}__${index}`
					return (
						<Col key={columnKey} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const state = item?.address?.state
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{state}
						</Col>
					)
				}
			},
			{
				key: 'zip',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.zip'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					const columnKey = `${key}__${name.replace(/\W/g, '')}__${index}`
					return (
						<Col key={columnKey} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<CustomTextFieldFilter
								filterLabel={name}
								onFilterChanged={(value) => filterColumnTextValue(key, value)}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const zip = item?.address?.zip
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{zip}
						</Col>
					)
				}
			}
		]

		return _pageColumns
	}, [filterColumnTextValue, filterRangedValues, locale, t, getDemographicValue, filterColumns])

	const loadClients = useCallback(() => {
		unfilteredList.current = activeClients.current
		setFilteredList(unfilteredList.current)

		const headerFilters: IFieldFilter[] = []
		const clientFilters = [
			'name',
			'gender',
			'race',
			'ethnicity',
			'dateOfBirth',
			'city',
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
		filters.current = headerFilters

		const clientsPageColumns = buildClientPageColumns()
		setPageColumns(clientsPageColumns)
		buildClientCSVFields()
	}, [activeClients, buildClientPageColumns, buildClientCSVFields])
	// #endregion Client Report functions

	const unloadReportData = useCallback(() => {
		setFilteredList([])
		setPageColumns([])
		setReportHeaderFilters([])
		setReportFilterOption(undefined)
		unfilteredList.current = []
		filters.current = []
	}, [])

	const loadReportData = useCallback(
		(value: ReportTypes) => {
			setReportType(value)

			if (!value) {
				unloadReportData()
			}

			if (value === ReportTypes.SERVICES) {
				unloadReportData()
				const filterOptions: FilterOptions = {
					options: activeServices.current.map((service) => ({
						label: service.name,
						value: service.id
					})),
					onChange: (option: OptionType) => loadSelectedService(option?.value)
				}
				setReportFilterOption(filterOptions)
			}

			if (value === ReportTypes.CLIENTS) {
				unloadReportData()
				setReportFilterOption(undefined)
				loadClients()
			}
		},
		[activeServices, loadSelectedService, loadClients, unloadReportData]
	)

	useEffect(() => {
		activeServices.current = serviceList.filter(
			(service) => service.serviceStatus !== ServiceStatus.Archive
		)
	}, [serviceList, activeServices])

	useEffect(() => {
		activeClients.current = contacts.filter((c) => c.status !== ContactStatus.Archived)
	}, [contacts, activeClients])

	useEffect(() => {
		if (!reportType) {
			loadReportData(ReportTypes.CLIENTS)
		}
	}, [reportType, loadReportData])

	const renderListTitle = useCallback(() => {
		const reportListOptions: FilterOptions = {
			options: [
				{ label: t('clientsTitle'), value: ReportTypes.CLIENTS },
				{ label: t('servicesTitle'), value: ReportTypes.SERVICES }
			],
			onChange: (option: OptionType) => loadReportData(option?.value)
		}

		return (
			<div>
				<h2 className='mb-3'>Reporting</h2>
				<div>
					<ReactSelect {...reportListOptions} defaultValue={reportListOptions.options[0]} />
				</div>
			</div>
		)
	}, [t, loadReportData])

	const downloadCSV = () => {
		const csvParser = new Parser({ fields: csvFields.current })
		const csv = csvParser.parse(filteredList)
		const csvData = new Blob([csv], { type: 'text/csv' })
		const csvURL = URL.createObjectURL(csvData)
		window.open(csvURL)
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.serviceList)}>
				<PaginatedList
					title={title}
					onRenderListTitle={renderListTitle}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					columnsClassName={styles.columnsHeaderRow}
					rowClassName={styles.itemRow}
					paginatorContainerClassName={styles.paginatorContainer}
					listItemsContainerClassName={filteredList.length > 0 ? styles.listItemsContainer : null}
					filterOptions={reportFilterOption}
					showSearch={false}
					isLoading={loading}
					exportButtonName={t('exportButton')}
					onExportDataButtonClick={() => downloadCSV()}
				/>
				<DeleteServiceRecordModal
					showModal={showModal}
					onSubmit={handleConfirmDelete}
					onDismiss={() => setShowModal(false)}
				/>
			</div>
		</ClientOnly>
	)
})
export default wrap(ReportList)
