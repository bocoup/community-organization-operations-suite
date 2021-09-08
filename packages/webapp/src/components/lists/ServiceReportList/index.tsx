/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Service, ServiceAnswers, ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import ClientOnly from '~components/ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { OptionType } from '~ui/ReactSelect'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Col } from 'react-bootstrap'
import { wrap } from '~utils/appinsights'

interface ServiceReportListProps extends ComponentProps {
	title?: string
	services?: Service[]
	loading?: boolean
}

interface IFieldFilter {
	name: string
	fieldType: string
	value: string[]
}

const filterStyles: Partial<IDropdownStyles> = {
	root: {
		maxWidth: '200px !important',
		marginTop: 10
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
		paddingLeft: 14
	},
	dropdownItemsWrapper: {
		border: '1px solid var(--bs-gray-4)',
		borderRadius: 4
	},
	dropdownItem: {
		fontSize: 14
	},
	dropdownItemSelected: {
		fontSize: 14
	},
	dropdownItemSelectedAndDisabled: {
		fontSize: 14
	}
}

const ServiceReportList = memo(function ServiceReportList({
	title,
	services = [],
	loading
}: ServiceReportListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<ServiceAnswers[]>([])
	const [selectedCustomForm, setSelectedCustomForm] = useState<ServiceCustomField[]>([])
	const allAnswers = useRef<ServiceAnswers[]>([])
	const [fieldFilter, setFieldFilter] = useState<IFieldFilter[]>([])

	const findSelectedService = (selectedService: OptionType) => {
		const _selectedService = services.find((s) => s.id === selectedService.value)
		allAnswers.current = _selectedService?.answers || []

		setSelectedCustomForm(_selectedService?.customFields || [])
		setFilteredList(allAnswers.current)
	}

	const filterOptions = {
		options: services.map((service) => ({ label: service.name, value: service.id })),
		onChange: findSelectedService
	}

	const filterHelper = (
		serviceAnswers: ServiceAnswers[],
		fieldName: string,
		fieldType: string,
		fieldValue: string | string[]
	): ServiceAnswers[] => {
		const tempList = []
		const _serviceAnswers = serviceAnswers.length === 0 ? allAnswers.current : serviceAnswers
		_serviceAnswers.forEach((answer) => {
			answer.fieldAnswers[fieldType].forEach((fieldAnswer) => {
				if (fieldAnswer.label === fieldName) {
					if (Array.isArray(fieldAnswer.value)) {
						if (fieldValue.length === 0) {
							tempList.push(answer)
						}
						if (fieldAnswer.value.some((value) => fieldValue.includes(value))) {
							tempList.push(answer)
						}
					} else {
						if (fieldValue.includes(fieldAnswer.value)) {
							tempList.push(answer)
						}
					}
				}
			})
		})

		return tempList
	}

	const filterAnswers = (field: ServiceCustomField, option: IDropdownOption) => {
		const fieldIndex = fieldFilter.findIndex((f) => f.name === field.fieldName)
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
			fieldFilter.forEach((field) => {
				_filteredAnswers = filterHelper(_filteredAnswers, field.name, field.fieldType, field.value)
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
					name: field.fieldName,
					fieldType: field.fieldType,
					value: []
				})
			}
		})

		setFieldFilter(initFilter)
	}, [selectedCustomForm])

	const pageColumns: IPaginatedListColumn[] = selectedCustomForm?.map((field, index) => ({
		key: `${field.fieldName.replaceAll(' ', '_')}-__key`,
		name: field.fieldName,
		onRenderColumnHeader: function onRenderColumnHeader() {
			const ddFieldType = ['singleChoice', 'multiChoice', 'multiText']
			if (ddFieldType.includes(field.fieldType)) {
				return (
					<Col key={index} className={cx('g-0', styles.columnHeader, styles.ddFieldHeader)}>
						<Dropdown
							placeholder={field.fieldName}
							multiSelect
							options={field.fieldValue.map((value) => ({ key: value, text: value }))}
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
			return item.fieldAnswers[field.fieldType]?.map((answer) => (
				<Col key={answer.value} className={cx('g-0', styles.columnItem)}>
					{field.fieldType !== 'date' ? answer.value : new Date(answer.value).toLocaleDateString()}
				</Col>
			))
		}
	}))

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
				/>
			</div>
		</ClientOnly>
	)
})
export default wrap(ServiceReportList)
