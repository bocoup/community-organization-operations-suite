/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import {
	Service,
	ServiceAnswerIdInput,
	ServiceAnswers,
	ServiceCustomField
} from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { OptionType } from '~ui/ReactSelect'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Col } from 'react-bootstrap'
import { wrap } from '~utils/appinsights'
import { Parser } from 'json2csv'
import { useTranslation } from '~hooks/useTranslation'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import CLIENT_DEMOGRAPHICS from '~utils/consts/CLIENT_DEMOGRAPHICS'

interface ServiceReportListProps extends ComponentProps {
	title?: string
	services?: Service[]
	loading?: boolean
	onDeleteRow?: (item: ServiceAnswerIdInput) => void
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

const ServiceReportList = memo(function ServiceReportList({
	title,
	services = [],
	loading,
	onDeleteRow
}: ServiceReportListProps): JSX.Element {
	const { t } = useTranslation(['reporting', 'clients'])
	const [filteredList, setFilteredList] = useState<ServiceAnswers[]>([])
	const [selectedCustomForm, setSelectedCustomForm] = useState<ServiceCustomField[]>([])
	const allAnswers = useRef<ServiceAnswers[]>([])
	const [fieldFilter, setFieldFilter] = useState<IFieldFilter[]>([])
	const [selectedService, setSelectedService] = useState<Service>()

	const findSelectedService = (selectedService: OptionType) => {
		const _selectedService = services.find((s) => s.id === selectedService?.value)
		allAnswers.current = _selectedService?.answers || []

		setSelectedService(_selectedService)
		setSelectedCustomForm(_selectedService?.customFields || [])
		setFilteredList(allAnswers.current)
	}

	const filterOptions = {
		options: services.map((service) => ({ label: service.name, value: service.id })),
		onChange: findSelectedService
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

	const filterAnswers = (field: ServiceCustomField, option: IDropdownOption) => {
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
			setFilteredList(allAnswers.current)
		} else {
			let _filteredAnswers = allAnswers.current
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
	}

	const filterDemographicHelper = (
		serviceAnswers: ServiceAnswers[],
		filterId: string,
		filterValue: string | string[]
	): ServiceAnswers[] => {
		const tempList = serviceAnswers.filter((answer) =>
			filterValue.includes(answer.contacts[0].demographics[filterId])
		)
		return tempList
	}

	const filterDemographics = (demographicType: string, option: IDropdownOption) => {
		const fieldIndex = fieldFilter.findIndex((f) => f.id === demographicType)
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
			setFilteredList(allAnswers.current)
		} else {
			let _filteredAnswers = allAnswers.current
			fieldFilter.forEach((filter) => {
				if (filter.value.length > 0) {
					_filteredAnswers = filterDemographicHelper(_filteredAnswers, filter.id, filter.value)
				}
				setFilteredList(_filteredAnswers)
			})
		}
	}

	useEffect(() => {
		const initFilter = []
		selectedCustomForm?.forEach((field) => {
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

		if (selectedService?.contactFormEnabled) {
			const demographicFilters = ['gender', 'race', 'ethnicity']
			demographicFilters.forEach((d) => {
				initFilter.push({
					id: d,
					name: t(`demographics.${d}.label`),
					fieldType: 'clientField',
					value: []
				})
			})
		}

		setFieldFilter(initFilter)
	}, [selectedCustomForm, selectedService])

	const getRowColumnValue = (answerItem: ServiceAnswers, field: ServiceCustomField) => {
		let answerValue = ''

		answerItem.fieldAnswers[field.fieldType]?.forEach((fieldAnswer) => {
			if (!Array.isArray(fieldAnswer.values)) {
				const ddFieldType = ['singleChoice', 'multiChoice', 'multiText']
				if (ddFieldType.includes(field.fieldType)) {
					answerValue = field.fieldValue.find((fv) => fv.id === fieldAnswer.values).label
				} else {
					if (field.fieldType === 'date') {
						answerValue = new Date(fieldAnswer.values).toLocaleDateString()
					} else {
						if (fieldAnswer.fieldId === field.fieldId) {
							answerValue = fieldAnswer.values
						}
					}
				}
			} else {
				answerValue = fieldAnswer.values
					.map((fav) => field.fieldValue.find((ffv) => ffv.id === fav).label)
					.join(', ')
			}
		})

		return answerValue
	}

	const pageColumns: IPaginatedListColumn[] = selectedCustomForm?.map((field, index) => ({
		key: field.fieldId,
		name: field.fieldName,
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
			return <Col className={cx('g-0', styles.columnItem)}>{_answerValue}</Col>
		}
	}))

	pageColumns.push({
		key: 'actions',
		name: '',
		className: 'd-flex justify-content-end',
		onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
			const columnActionButtons: IMultiActionButtons<ServiceAnswers>[] = [
				{
					name: t('serviceListRowActions.delete'),
					className: cx(styles.editButton),
					onActionClick: function onActionClick(item: ServiceAnswers) {
						const newAnswers = [...allAnswers.current]
						newAnswers.splice(allAnswers.current.indexOf(item), 1)
						setFilteredList(newAnswers)
						allAnswers.current = newAnswers
						onDeleteRow?.({
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
		pageColumns.unshift(
			{
				key: 'contact',
				onRenderColumnHeader: function onRenderColumnHeader() {
					return (
						<Col className={cx('g-0', styles.columnHeader, styles.plainFieldHeader)}>
							{t('clientList.columns.name')}
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
					const fullname = `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					return <Col className={cx('g-0', styles.columnItem)}>{fullname}</Col>
				}
			},
			{
				key: 'gender',
				onRenderColumnHeader: function onRenderColumnHeader() {
					return (
						<Col className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
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
									filterDemographics('gender', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
					const gender =
						t(`demographics.gender.options.${item.contacts[0].demographics.gender}`) || ''
					return <Col className={cx('g-0', styles.columnItem)}>{gender}</Col>
				}
			},
			{
				key: 'race',
				onRenderColumnHeader: function onRenderColumnHeader() {
					return (
						<Col className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
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
									filterDemographics('race', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
					const race = t(`demographics.race.options.${item.contacts[0].demographics.race}`) || ''
					return <Col className={cx('g-0', styles.columnItem)}>{race}</Col>
				}
			},
			{
				key: 'ethnicity',
				name: t('demographics.ethnicity.label'),
				onRenderColumnHeader: function onRenderColumnHeader() {
					return (
						<Col className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
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
									filterDemographics('ethnicity', option)
								}}
							/>
						</Col>
					)
				},
				onRenderColumnItem: function onRenderColumnItem(item: ServiceAnswers) {
					const ethnicity =
						t(`demographics.ethnicity.options.${item.contacts[0].demographics.ethnicity}`) || ''
					return <Col className={cx('g-0', styles.columnItem)}>{ethnicity}</Col>
				}
			}
		)
	}

	const downloadCSV = () => {
		const csvFields = selectedCustomForm?.map((field) => {
			return {
				label: field.fieldName,
				value: (item: ServiceAnswers) => {
					return getRowColumnValue(item, field)
				}
			}
		})

		if (selectedService?.contactFormEnabled) {
			csvFields.unshift(
				{
					label: t('clientList.columns.name'),
					value: (item: ServiceAnswers) => {
						return `${item.contacts[0].name.first} ${item.contacts[0].name.last}`
					}
				},
				{
					label: t('demographics.gender.label'),
					value: (item: ServiceAnswers) => {
						const gender =
							t(`demographics.gender.options.${item.contacts[0].demographics.gender}`) || ''
						return gender
					}
				},
				{
					label: t('demographics.race.label'),
					value: (item: ServiceAnswers) => {
						const race = t(`demographics.race.options.${item.contacts[0].demographics.race}`) || ''
						return race
					}
				},
				{
					label: t('demographics.ethnicity.label'),
					value: (item: ServiceAnswers) => {
						const ethnicity =
							t(`demographics.ethnicity.options.${item.contacts[0].demographics.ethnicity}`) || ''
						return ethnicity
					}
				}
			)
		}

		const csvParser = new Parser({ fields: csvFields })
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
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={'align-items-center'}
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
export default wrap(ServiceReportList)
