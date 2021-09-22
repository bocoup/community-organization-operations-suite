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
	ActionButton
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

	const [filteredList, setFilteredList] = useState<any[]>([])
	const unfilteredListData = useRef<{ listType: string; list: any }>({ listType: '', list: [] })
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
	const filterServiceDemographicHelper = (
		serviceAnswers: ServiceAnswers[],
		filterId: string,
		filterValue: string | string[]
	): ServiceAnswers[] => {
		const tempList = serviceAnswers.filter((answer) =>
			filterValue.includes(answer.contacts[0].demographics[filterId])
		)
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
				const [from, to] = filterValue as string[]
				if (!from && !to) {
					return true
				}

				if (from && to) {
					return (
						new Date(contact.dateOfBirth) >= new Date(from) &&
						new Date(contact.dateOfBirth) <= new Date(to)
					)
				}

				if (!from && to) {
					return new Date(contact.dateOfBirth) <= new Date(to)
				}

				if (from && !to) {
					return new Date(contact.dateOfBirth) >= new Date(from)
				}

				return false
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

	const getDemographicValue = useCallback(
		(demographicKey: string, contact: Contact): string => {
			switch (contact?.demographics?.[demographicKey]) {
				case '':
				case 'unknown':
					return t(`demographics.notProvided`)
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
						_filteredAnswers = filterServiceDemographicHelper(
							_filteredAnswers,
							filter.id,
							filter.value
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
			setSelectedService(null)
			setSelectedCustomForm([])
			setFilteredList([])
		} else {
			const _selectedService = serviceList.find((s) => s.id === selectedService?.value)
			unfilteredListData.current.list = _selectedService?.answers || []

			const initFilter = []
			_selectedService.customFields?.forEach((field) => {
				const ddFieldType = ['singleChoice', 'multiChoice', 'multiText']
				if (ddFieldType.includes(field.fieldType)) {
					initFilter.push({
						id: field.fieldId,
						name: field.fieldName,
						fieldType: field.fieldType,
						value: []
					})
				}
			})

			if (_selectedService?.contactFormEnabled) {
				const demographicFilters = ['gender', 'race', 'ethnicity']
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

	const filterAnswersHelper = (
		serviceAnswers: ServiceAnswers[],
		filterId: string,
		filterFieldType: string,
		filterValue: string | string[]
	): ServiceAnswers[] => {
		const tempList = []
		serviceAnswers.forEach((answer) => {
			answer.fieldAnswers[filterFieldType].forEach((fieldAnswer) => {
				if (fieldAnswer.fieldId === filterId) {
					if (Array.isArray(fieldAnswer.values)) {
						if (filterValue.length === 0) {
							tempList.push(answer)
						}
						if (fieldAnswer.values.some((value) => filterValue.includes(value))) {
							tempList.push(answer)
						}
					} else {
						if (filterValue.includes(fieldAnswer.values)) {
							tempList.push(answer)
						}
					}
				}
			})
		})

		return tempList
	}

	const filterAnswers = useCallback(
		(field: ServiceCustomField, option: IDropdownOption) => {
			const fieldIndex = fieldFilter.findIndex((f) => f.id === field.fieldId)
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

			if (!fieldFilter.some(({ value }) => value.length > 0)) {
				setFilteredList(unfilteredListData.current.list)
			} else {
				let _filteredAnswers = unfilteredListData.current.list
				fieldFilter.forEach((filter) => {
					if (filter.value.length > 0) {
						_filteredAnswers = filterAnswersHelper(
							_filteredAnswers,
							filter.id,
							filter.fieldType,
							filter.value
						)
					}
					setFilteredList(_filteredAnswers)
				})
			}
		},
		[fieldFilter]
	)

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
									filterAnswers(field, option)
								}}
							/>
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
						onActionClick: function onActionClick(item: ServiceAnswers) {
							const newAnswers = [...unfilteredListData.current.list]
							newAnswers.splice(unfilteredListData.current.list.indexOf(item), 1)
							setFilteredList(newAnswers)
							unfilteredListData.current.list = newAnswers
							handleDeleteServiceDataRow({
								serviceId: selectedService.id,
								answerId: item.id
							})
						}
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
					onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
						return (
							<Col
								key={`${key}__${name}__${index}`}
								className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}
							>
								{t('clientList.columns.name')}
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
		filterAnswers,
		filterColumns,
		getRowColumnValue,
		handleDeleteServiceDataRow,
		t,
		getDemographicValue
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
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}
						>
							{t('clientList.columns.name')}
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
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}
						>
							{t('customFilters.city')}
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const city = item?.address?.city || t('customFilters.notProvided')
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
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}
						>
							{t('customFilters.state')}
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const state = item?.address?.state || t('customFilters.notProvided')
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{state}
						</Col>
					)
				}
			},
			{
				key: 'zipCode',
				itemClassName: styles.columnRowItem,
				name: t('customFilters.zip'),
				onRenderColumnHeader: function onRenderColumnHeader(key, name, index) {
					return (
						<Col
							key={`${key}__${index}`}
							className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}
						>
							{t('customFilters.zip')}
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: Contact, index: number) {
					const zipCode = item?.address?.zip || t('customFilters.notProvided')
					return (
						<Col key={index} className={cx('g-0', styles.columnItem)}>
							{zipCode}
						</Col>
					)
				}
			}
		]

		return _pageColumns
	}, [filterColumns, filterDateRange, t, updateCustomFilter, getDemographicValue])

	const initClientListData = () => {
		unfilteredListData.current.listType = 'clients'
		unfilteredListData.current.list = contacts.filter((c) => c.status !== ContactStatus.Archived)

		const initFilter = []
		const clientFilters = ['gender', 'race', 'ethnicity', 'dateOfBirth']
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
					value: (item: Contact) => item?.address?.city || t('customFilters.notProvided')
				},
				{
					label: t('customFilters.state'),
					value: (item: Contact) => item?.address?.state || t('customFilters.notProvided')
				},
				{
					label: t('customFilters.zip'),
					value: (item: Contact) => item?.address?.zip || t('customFilters.notProvided')
				}
			]
		}
	}, [unfilteredListData.current.listType, selectedService, getDemographicValue, getRowColumnValue, t])

	// place generated columns in useRef to avoid re-rendering inside useEffect
	const pageColumnRefs = useRef<any>({})
	pageColumnRefs.current.services = getServicePageColumns()
	pageColumnRefs.current.clients = getClientsPageColumns()

	useEffect(() => {
		let columns: IPaginatedListColumn[] = []

		if (unfilteredListData.current.listType === 'services') {
			if (selectedService) {
				columns = pageColumnRefs.current.services
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
			</div>
		</ClientOnly>
	)
})
export default wrap(ReportList)
