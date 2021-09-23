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
	ServiceAnswerIdInput,
	ServiceAnswers,
	ServiceCustomField,
	ServiceStatus
} from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { FilterOptions, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import ReactSelect, { OptionType } from '~ui/ReactSelect'
import {
	Callout,
	Dropdown,
	FontIcon,
	IDropdownOption,
	IDropdownStyles,
	DatePicker,
	IDatePickerStyles,
	ActionButton,
	TextField,
	ITextFieldStyles
} from '@fluentui/react'
import { Col } from 'react-bootstrap'
import { wrap } from '~utils/appinsights'
import { Parser } from 'json2csv'
import { useTranslation } from '~hooks/useTranslation'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import CLIENT_DEMOGRAPHICS from '~utils/consts/CLIENT_DEMOGRAPHICS'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'
import { useContacts } from '~hooks/api/useContacts'
import Icon from '~ui/Icon'
import { useForceUpdate } from '@fluentui/react-hooks'
import DeleteServiceRecordModal from '~components/ui/DeleteServiceRecordModal'

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

const filterTextStyles: Partial<ITextFieldStyles> = {
	field: {
		fontSize: 12,
		'::placeholder': {
			fontSize: 12,
			color: 'var(--bs-text-muted)'
		}
	},
	fieldGroup: {
		borderColor: 'var(--bs-gray-4)',
		borderRadius: 4,
		':hover': {
			borderColor: 'var(--bs-primary)'
		},
		':after': {
			borderRadius: 4,
			borderWidth: 1
		}
	}
}

const datePickerStyles: Partial<IDatePickerStyles> = {
	root: {
		border: 0
	},
	wrapper: {
		border: 0
	},
	textField: {
		selectors: {
			'.ms-TextField-field': {
				fontSize: 12
			},
			'.ms-TextField-fieldGroup': {
				borderRadius: 4,
				height: 34,
				borderColor: 'var(--bs-gray-4)',
				':after': {
					outline: 0,
					border: 0
				},
				':hover': {
					borderColor: 'var(--bs-primary)'
				}
			},
			'.ms-Label': {
				fontSize: 12,
				':after': {
					color: 'var(--bs-danger)'
				}
			}
		}
	}
}

const ReportList = memo(function ReportList({ title }: ReportListProps): JSX.Element {
	const { t } = useTranslation(['reporting', 'clients', 'services'])
	const { orgId } = useCurrentUser()
	const { serviceList, loading, deleteServiceAnswer } = useServiceList(orgId)
	const { contacts } = useContacts()
	const [recordToDelete, setRecordToDelete] = useState<ServiceAnswers | undefined>()
	const [showModal, setShowModal] = useState(false)

	const [filteredList, setFilteredList] = useState<any[]>([])
	const unfilteredListData = useRef<{ listType: string; list: any[] }>({ listType: '', list: [] })
	const customFilter = useRef<{ [id: string]: { isVisible: boolean; value: any } }>({})
	const updateCustomFilter = useForceUpdate()

	// service report states
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [selectedCustomForm, setSelectedCustomForm] = useState<ServiceCustomField[]>([])
	const [fieldFilter, setFieldFilter] = useState<IFieldFilter[]>([])

	// paginated list configs
	const [pageColumns, setPageColumns] = useState<IPaginatedListColumn[]>([])
	const [filterOptions, setFilterOptions] = useState<FilterOptions | undefined>(undefined)

	const csvFields = useRef<{ label: string; value: (item: any) => string }[]>([])

	//#region Shared report functions
	const filterServiceHelper = (
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
	}

	const filterClientHelper = (
		filteredContacts: Contact[],
		filterId: string,
		filterValue: string | string[]
	): Contact[] => {
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
	}

	const filterColumns = useCallback(
		(columnId: string, option: IDropdownOption) => {
			const fieldIndex = fieldFilter.findIndex((f) => f.id === columnId)
			if (option.selected) {
				const newFilter = [...fieldFilter]
				if (!newFilter[fieldIndex]?.value.includes(option.key as string)) {
					newFilter[fieldIndex]?.value.push(option.key as string)
				}
				setFieldFilter(newFilter)
			} else {
				const newFilter = [...fieldFilter]
				const optionIndex = newFilter[fieldIndex]?.value.indexOf(option.key as string)
				if (optionIndex > -1) {
					newFilter[fieldIndex]?.value.splice(optionIndex, 1)
				}
				setFieldFilter(newFilter)
			}
		},
		[fieldFilter]
	)

	const filterDateRange = useCallback(
		(key: string, value: string[]) => {
			const newFilter = [...fieldFilter]
			newFilter[fieldFilter.findIndex((f) => f.id === key)].value = value
			setFieldFilter(newFilter)
		},
		[fieldFilter]
	)

	const filterNumberRange = useCallback(
		(key: string, value: string[]) => {
			const newFilter = [...fieldFilter]
			newFilter[fieldFilter.findIndex((f) => f.id === key)].value = value
			setFieldFilter(newFilter)
		},
		[fieldFilter]
	)

	const filterColumnTextValue = useCallback(
		(key: string, value: string) => {
			const newFilter = [...fieldFilter]
			newFilter[fieldFilter.findIndex((f) => f.id === key)].value = [value]
			setFieldFilter(newFilter)
		},
		[fieldFilter]
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
		if (!fieldFilter.some(({ value }) => value.length > 0)) {
			setFilteredList(unfilteredListData.current.list)
		} else {
			let _filteredAnswers = unfilteredListData.current.list
			fieldFilter.forEach((filter) => {
				if (filter.value.length > 0) {
					if (unfilteredListData.current.listType === 'services') {
						_filteredAnswers = filterServiceHelper(
							_filteredAnswers,
							filter.id,
							filter.value,
							filter.fieldType
						)
					}
					if (unfilteredListData.current.listType === 'clients') {
						_filteredAnswers = filterClientHelper(_filteredAnswers, filter.id, filter.value)
					}
				}
				setFilteredList(_filteredAnswers)
			})
		}
	}, [fieldFilter])

	//#endregion Shared report functions

	//#region functions for Service Report
	const findSelectedService = (selectedService: OptionType) => {
		if (selectedService === null) {
			unfilteredListData.current.list = []
			unfilteredListData.current.listType = null
			setSelectedService(null)
			setSelectedCustomForm([])
			setFilteredList([])
		} else {
			unfilteredListData.current.listType = 'services'
			const _selectedService = serviceList.find((s) => s.id === selectedService?.value)
			unfilteredListData.current.list = _selectedService?.answers || []

			const initFilter: IFieldFilter[] = []
			_selectedService.customFields?.forEach((field) => {
				initFilter.push({
					id: field.fieldId,
					name: field.fieldName,
					fieldType: field.fieldType,
					value: []
				})
			})

			if (_selectedService?.contactFormEnabled) {
				const demographicFilters = ['name', 'gender', 'race', 'ethnicity']
				demographicFilters.forEach((d) => {
					initFilter.push({
						id: d,
						name: d,
						fieldType: 'clientField',
						value: []
					})
				})
			}

			setFieldFilter(initFilter)
			setSelectedService(_selectedService)
			setSelectedCustomForm(_selectedService?.customFields || [])
			setFilteredList(unfilteredListData.current.list)
		}
	}

	const getRowColumnValue = useCallback(
		(answerItem: ServiceAnswers, field: ServiceCustomField) => {
			let answerValue = ''

			const answers = answerItem.fieldAnswers[field.fieldType]?.find(
				(a) => a.fieldId === field.fieldId
			)
			if (answers) {
				const fieldValue = selectedCustomForm.find((f) => f.fieldId === answers.fieldId).fieldValue

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
							answerValue = new Date(answers.values).toLocaleDateString()
							break
						default:
							answerValue = answers.values
					}
				}
			} else {
				answerValue = ''
			}

			return answerValue
		},
		[selectedCustomForm]
	)

	const handleDeleteServiceDataRow = useCallback(
		(item: ServiceAnswerIdInput) => {
			deleteServiceAnswer(item)
		},
		[deleteServiceAnswer]
	)

	const handleDeleteServiceAnswerAction = (serviceAnswer: ServiceAnswers) => {
		// Save the record to delete and open the confirmation modal
		setRecordToDelete(serviceAnswer)
		setShowModal(true)
	}

	const handleConfirmDelete = () => {
		const newAnswers = [...unfilteredListData.current.list]
		newAnswers.splice(unfilteredListData.current.list.indexOf(recordToDelete), 1)
		setFilteredList(newAnswers)
		unfilteredListData.current.list = newAnswers
		handleDeleteServiceDataRow({
			serviceId: selectedService.id,
			answerId: recordToDelete.id
		})

		// Hide modal
		setShowModal(false)
	}

	const getServicePageColumns = useCallback((): IPaginatedListColumn[] => {
		const _pageColumns: IPaginatedListColumn[] = selectedCustomForm.map((field, index) => ({
			key: field.fieldId,
			name: field.fieldName,
			itemClassName: styles.columnRowItem,
			onRenderColumnHeader: function onRenderColumnHeader() {
				const ddFieldType = ['singleChoice', 'multiChoice', 'multiText']
				if (ddFieldType.includes(field.fieldType)) {
					return (
						<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<Dropdown
								placeholder={field.fieldName}
								multiSelect
								options={field.fieldValue.map((value) => ({ key: value.id, text: value.label }))}
								styles={filterStyles}
								onRenderTitle={() => <>{field.fieldName}</>}
								onRenderCaretDown={() => (
									<FontIcon iconName='FilterSolid' style={{ fontSize: '14px' }} />
								)}
								onChange={(event, option) => {
									filterColumns(field.fieldId, option)
								}}
							/>
						</Col>
					)
				} else if (field.fieldType === 'singleText' || field.fieldType === 'multilineText') {
					const filterId = `${field.fieldId.replaceAll('-', '_')}__${index}__filter_callout`
					const key = field.fieldId
					return (
						<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: ''
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{field.fieldName}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.textFieldFilter}>
										<TextField
											placeholder={t('customFilters.typeHere')}
											value={customFilter.current[key].value}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = value
												filterColumnTextValue(field.fieldId, value)
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = ''
												filterColumnTextValue(field.fieldId, customFilter.current[key].value)
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
				} else if (field.fieldType === 'date') {
					const filterId = `${field.fieldName.replaceAll(' ', '_')}__${index}__filter_callout`
					const key = field.fieldId
					return (
						<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: {
												to: '',
												from: ''
											}
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{field.fieldName}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										filterDateRange(key, [
											customFilter.current[key].value.from,
											customFilter.current[key].value.to
										])
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.dateRangeFilter}>
										<DatePicker
											label={t('customFilters.dateFrom')}
											value={
												customFilter.current[key].value?.from
													? new Date(customFilter.current[key].value.from)
													: null
											}
											maxDate={
												customFilter.current[key].value?.to
													? new Date(customFilter.current[key].value.to)
													: null
											}
											onSelectDate={(date) => {
												customFilter.current[key].value.from = date?.toISOString()
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
											allowTextInput
											styles={datePickerStyles}
										/>
										<DatePicker
											label={t('customFilters.dateTo')}
											value={
												customFilter.current[key].value?.to
													? new Date(customFilter.current[key].value.to)
													: null
											}
											minDate={
												customFilter.current[key].value?.from
													? new Date(customFilter.current[key].value.from)
													: null
											}
											//maxDate={new Date()}
											onSelectDate={(date) => {
												customFilter.current[key].value.to = date?.toISOString()
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
											allowTextInput
											styles={datePickerStyles}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = {
													to: '',
													from: ''
												}
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
				} else if (field.fieldType === 'number') {
					const filterId = `${field.fieldName.replaceAll(' ', '_')}__${index}__filter_callout`
					const key = field.fieldId
					// get min and max values from service answers
					let min = 0
					let max = 0
					selectedService.answers.forEach((answer) => {
						answer.fieldAnswers[field.fieldType]?.forEach((fieldAnswer) => {
							if (fieldAnswer.fieldId === field.fieldId) {
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
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: {
												lower: min,
												upper: max
											}
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{field.fieldName}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.numberRangeFilter}>
										<TextField
											label={'Min value'}
											placeholder={min.toString()}
											defaultValue={customFilter.current[key].value.lower.toString()}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = {
													lower: value || min,
													upper: customFilter.current[key].value.upper || max
												}
												filterNumberRange(key, [
													customFilter.current[key].value.lower,
													customFilter.current[key].value.upper
												])
											}}
										/>
										<TextField
											label={'Max value'}
											placeholder={max.toString()}
											defaultValue={customFilter.current[key].value.upper.toString()}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = {
													lower: customFilter.current[key].value.lower || min,
													upper: value || max
												}
												filterNumberRange(key, [
													customFilter.current[key].value.lower,
													customFilter.current[key].value.upper
												])
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = {
													lower: min,
													upper: max
												}
												filterDateRange(key, [
													customFilter.current[key].value.lower,
													customFilter.current[key].value.upper
												])
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
				} else {
					return (
						<Col key={index} className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}>
							{field.fieldName}
						</Col>
					)
				}
			},
			onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
				const _answerValue = getRowColumnValue(item, field)
				return (
					<Col key={`row-${index}`} className={cx('g-0', styles.columnItem)}>
						{_answerValue}
					</Col>
				)
			}
		}))

		// row action column
		_pageColumns?.push({
			key: 'actions',
			name: '',
			className: cx('d-flex justify-content-end', styles.columnActionRowHeader),
			itemClassName: styles.columnActionRowItem,
			onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
				const columnActionButtons: IMultiActionButtons<ServiceAnswers>[] = [
					{
						name: t('serviceListRowActions.delete'),
						className: cx(styles.editButton),
						onActionClick: handleDeleteServiceAnswerAction
					}
				]
				return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
			}
		})

		if (selectedService?.contactFormEnabled) {
			_pageColumns.unshift(
				{
					key: 'contact',
					itemClassName: styles.columnRowItem,
					name: t('clientList.columns.name'),
					onRenderColumnHeader: function onRenderColumnHeader(_key, name, index) {
						const filterId = `${_key}__${index}__filter_callout`
						const key = `${_key}__${name.replaceAll(' ', '_')}__${index}`
						return (
							<Col key={key} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
								<button
									id={filterId}
									className={styles.customFilterButton}
									onClick={() => {
										if (!customFilter.current[key]) {
											customFilter.current[key] = {
												isVisible: true,
												value: ''
											}
										} else {
											customFilter.current[key].isVisible = !customFilter.current[key].isVisible
										}
										updateCustomFilter()
									}}
								>
									<span>{t('clientList.columns.name')}</span>
									<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
								</button>
								{customFilter.current?.[key]?.isVisible ? (
									<Callout
										className={styles.callout}
										gapSpace={0}
										target={`#${filterId}`}
										isBeakVisible={false}
										onDismiss={() => {
											customFilter.current[key].isVisible = false
											updateCustomFilter()
										}}
										directionalHint={4}
										setInitialFocus
									>
										<div className={styles.textFieldFilter}>
											<TextField
												placeholder={t('customFilters.typeHere')}
												value={customFilter.current[key].value}
												styles={filterTextStyles}
												onChange={(event, value) => {
													customFilter.current[key].value = value
													filterColumnTextValue('name', value)
												}}
											/>
											<ActionButton
												iconProps={{ iconName: 'Clear' }}
												styles={{
													textContainer: {
														fontSize: 12
													},
													icon: {
														fontSize: 12
													}
												}}
												onClick={() => {
													customFilter.current[key].value = ''
													filterColumnTextValue('name', customFilter.current[key].value)
													updateCustomFilter()
												}}
											>
												{t('customFilters.clearFilter')}
											</ActionButton>
										</div>
									</Callout>
								) : null}
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

		return _pageColumns
	}, [
		selectedService,
		selectedCustomForm,
		filterColumns,
		getRowColumnValue,
		t,
		getDemographicValue,
		filterColumnTextValue,
		filterDateRange,
		filterNumberRange,
		updateCustomFilter
	])

	const initServicesListData = () => {
		unfilteredListData.current.listType = 'services'
		const activeServices = serviceList.filter((s) => s.serviceStatus !== ServiceStatus.Archive)
		const filterOptions = {
			options: activeServices.map((service) => ({ label: service.name, value: service.id })),
			onChange: findSelectedService
		}
		setFilterOptions(filterOptions)
	}
	//#endregion functions for Service Report

	//#region functions for Client Report

	const getClientsPageColumns = useCallback((): IPaginatedListColumn[] => {
		const _pageColumns: IPaginatedListColumn[] = [
			{
				key: 'contact',
				itemClassName: styles.columnRowItem,
				name: t('clientList.columns.name'),
				onRenderColumnHeader: function onRenderColumnHeader(_key, name, index) {
					const filterId = `${_key}__${index}__filter_callout`
					const key = `${_key}__${name.replaceAll(' ', '_')}__${index}`
					return (
						<Col key={key} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: ''
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{t('clientList.columns.name')}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.textFieldFilter}>
										<TextField
											placeholder={t('customFilters.typeHere')}
											value={customFilter.current[key].value}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = value
												filterColumnTextValue('name', value)
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = ''
												filterColumnTextValue('name', customFilter.current[key].value)
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
					// return (
					// 	<Col
					// 		key={`${key}__${index}`}
					// 		className={cx('g-0', styles.columnHeader, styles.textFieldFilter)}
					// 	>
					// 		<TextField
					// 			placeholder={t('clientList.columns.name')}
					// 			styles={filterTextStyles}
					// 			onChange={(event, value) => {
					// 				filterColumnTextValue('name', value)
					// 			}}
					// 		/>
					// 	</Col>
					// )
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
					const filterId = `${key}__${index}__filter_callout`
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}
						>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: {
												to: '',
												from: ''
											}
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{t('customFilters.birthdate')}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										filterDateRange(key, [
											customFilter.current[key].value.from,
											customFilter.current[key].value.to
										])
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.dateRangeFilter}>
										<DatePicker
											label={t('customFilters.dateFrom')}
											value={
												customFilter.current[key].value?.from
													? new Date(customFilter.current[key].value.from)
													: null
											}
											maxDate={
												customFilter.current[key].value?.to
													? new Date(customFilter.current[key].value.to)
													: null
											}
											onSelectDate={(date) => {
												customFilter.current[key].value.from = date?.toISOString()
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
											allowTextInput
											styles={datePickerStyles}
										/>
										<DatePicker
											label={t('customFilters.dateTo')}
											value={
												customFilter.current[key].value?.to
													? new Date(customFilter.current[key].value.to)
													: null
											}
											minDate={
												customFilter.current[key].value?.from
													? new Date(customFilter.current[key].value.from)
													: null
											}
											maxDate={new Date()}
											onSelectDate={(date) => {
												customFilter.current[key].value.to = date?.toISOString()
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
											allowTextInput
											styles={datePickerStyles}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = {
													to: '',
													from: ''
												}
												filterDateRange(key, [
													customFilter.current[key].value.from,
													customFilter.current[key].value.to
												])
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{new Date(item.dateOfBirth).toLocaleDateString()}
						</Col>
					)
				}
			},
			{
				key: 'city',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.city'),
				onRenderColumnHeader: function onRenderColumnHeader(_key, name, index) {
					const filterId = `${_key}__${index}__filter_callout`
					const key = `${_key}__${name.replaceAll(' ', '_')}__${index}`
					return (
						<Col key={key} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: ''
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{t('customFilters.city')}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.textFieldFilter}>
										<TextField
											placeholder={t('customFilters.typeHere')}
											value={customFilter.current[key].value}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = value
												filterColumnTextValue('city', value)
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = ''
												filterColumnTextValue('city', customFilter.current[key].value)
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
					// return (
					// 	<Col
					// 		key={`${key}__${index}`}
					// 		className={cx('g-0', styles.columnHeader, styles.textFieldFilter)}
					// 	>
					// 		<TextField
					// 			placeholder={t('customFilters.city')}
					// 			styles={filterTextStyles}
					// 			onChange={(event, value) => {
					// 				filterColumnTextValue('city', value)
					// 			}}
					// 		/>
					// 	</Col>
					// )
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
				onRenderColumnHeader: function onRenderColumnHeader(_key, name, index) {
					const filterId = `${_key}__${index}__filter_callout`
					const key = `${_key}__${name.replaceAll(' ', '_')}__${index}`
					return (
						<Col key={key} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: ''
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{t('customFilters.state')}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.textFieldFilter}>
										<TextField
											placeholder={t('customFilters.typeHere')}
											value={customFilter.current[key].value}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = value
												filterColumnTextValue('state', value)
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = ''
												filterColumnTextValue('state', customFilter.current[key].value)
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
					// return (
					// 	<Col
					// 		key={`${key}__${index}`}
					// 		className={cx('g-0', styles.columnHeader, styles.textFieldFilter)}
					// 	>
					// 		<TextField
					// 			placeholder={t('customFilters.state')}
					// 			styles={filterTextStyles}
					// 			onChange={(event, value) => {
					// 				filterColumnTextValue('state', value)
					// 			}}
					// 		/>
					// 	</Col>
					// )
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
				onRenderColumnHeader: function onRenderColumnHeader(_key, name, index) {
					const filterId = `${_key}__${index}__filter_callout`
					const key = `${_key}__${name.replaceAll(' ', '_')}__${index}`
					return (
						<Col key={key} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
							<button
								id={filterId}
								className={styles.customFilterButton}
								onClick={() => {
									if (!customFilter.current[key]) {
										customFilter.current[key] = {
											isVisible: true,
											value: ''
										}
									} else {
										customFilter.current[key].isVisible = !customFilter.current[key].isVisible
									}
									updateCustomFilter()
								}}
							>
								<span>{t('customFilters.zip')}</span>
								<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
							</button>
							{customFilter.current?.[key]?.isVisible ? (
								<Callout
									className={styles.callout}
									gapSpace={0}
									target={`#${filterId}`}
									isBeakVisible={false}
									onDismiss={() => {
										customFilter.current[key].isVisible = false
										updateCustomFilter()
									}}
									directionalHint={4}
									setInitialFocus
								>
									<div className={styles.textFieldFilter}>
										<TextField
											placeholder={t('customFilters.typeHere')}
											value={customFilter.current[key].value}
											styles={filterTextStyles}
											onChange={(event, value) => {
												customFilter.current[key].value = value
												filterColumnTextValue('zip', value)
											}}
										/>
										<ActionButton
											iconProps={{ iconName: 'Clear' }}
											styles={{
												textContainer: {
													fontSize: 12
												},
												icon: {
													fontSize: 12
												}
											}}
											onClick={() => {
												customFilter.current[key].value = ''
												filterColumnTextValue('zip', customFilter.current[key].value)
												updateCustomFilter()
											}}
										>
											{t('customFilters.clearFilter')}
										</ActionButton>
									</div>
								</Callout>
							) : null}
						</Col>
					)
					// return (
					// 	<Col
					// 		key={`${key}__${index}`}
					// 		className={cx('g-0', styles.columnHeader, styles.textFieldFilter)}
					// 	>
					// 		<TextField
					// 			placeholder={t('customFilters.zip')}
					// 			styles={filterTextStyles}
					// 			onChange={(event, value) => {
					// 				filterColumnTextValue('zip', value)
					// 			}}
					// 		/>
					// 	</Col>
					// )
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
	}, [
		filterColumns,
		filterDateRange,
		t,
		updateCustomFilter,
		getDemographicValue,
		filterColumnTextValue
	])

	const initClientListData = () => {
		unfilteredListData.current.listType = 'clients'
		unfilteredListData.current.list = contacts.filter((c) => c.status !== ContactStatus.Archived)

		const initFilter = []
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
		clientFilters.forEach((d) => {
			initFilter.push({
				id: d,
				name: d,
				fieldType: 'clientField',
				value: []
			})
		})
		setFilterOptions(undefined)
		setFieldFilter(initFilter)
		setFilteredList(unfilteredListData.current.list)
	}
	//#endregion functions for Client Report

	const getSelectedReportData = (value) => {
		setFilterOptions(undefined)
		setFilteredList([])
		setPageColumns([])
		setSelectedService(null)
		setSelectedCustomForm([])
		unfilteredListData.current.list = []
		unfilteredListData.current.listType = ''

		switch (value) {
			case 'services':
				initServicesListData()
				break
			case 'clients':
				initClientListData()
				break
		}
	}

	const reportListOptions: FilterOptions = {
		options: [
			{ label: t('servicesTitle'), value: 'services' },
			{ label: t('clientsTitle'), value: 'clients' }
		],
		onChange: (option: OptionType) => getSelectedReportData(option?.value)
	}

	const renderListTitle = () => {
		return (
			<div>
				<h2 className='mb-3'>Reporting</h2>
				<div>
					<ReactSelect {...reportListOptions} />
				</div>
			</div>
		)
	}

	// useEffect to build csv columns
	useEffect(() => {
		if (unfilteredListData.current.listType === 'services') {
			if (selectedService) {
				csvFields.current = selectedService.customFields.map((field) => {
					return {
						label: field.fieldName,
						value: (item: ServiceAnswers) => {
							return getRowColumnValue(item, field)
						}
					}
				})

				if (selectedService.contactFormEnabled) {
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
			}
		}

		if (unfilteredListData.current.listType === 'clients') {
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
					value: (item: Contact) => new Date(item.dateOfBirth).toLocaleDateString()
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
		}
	}, [unfilteredListData.current.listType, selectedService, getDemographicValue, getRowColumnValue, t])

	// place generated columns in useRef to avoid re-rendering inside useEffect
	const pageColumnRefs = useRef<any>({})
	pageColumnRefs.current.services = getServicePageColumns()
	pageColumnRefs.current.clients = getClientsPageColumns()

	// useEffect to toggle between services and clients columns
	useEffect(() => {
		let columns: IPaginatedListColumn[] = []

		if (unfilteredListData.current.listType === 'services') {
			if (selectedService) {
				columns = pageColumnRefs.current.services
			} else {
				columns = []
			}
		}
		if (unfilteredListData.current.listType === 'clients') {
			columns = pageColumnRefs.current.clients
		}

		setPageColumns(columns)
	}, [unfilteredListData.current.listType, selectedService, pageColumnRefs])

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
					filterOptions={filterOptions}
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
